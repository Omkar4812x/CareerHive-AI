import asyncio
import json
from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from fastapi.responses import StreamingResponse
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from typing import List

from app.database import get_db, AsyncSessionLocal
from app.models import SearchMission, CandidateProfile, Job, JobMatch, AgentTask
from app.schemas import MissionCreate, MissionResponse
from app.agents.ceo_agent import ceo_agent
from app.services.sse_manager import sse_manager

router = APIRouter(prefix="/api/missions", tags=["Search Missions"])

async def run_mission_background(mission_id: str, user_prompt: str, profile_dict: dict):
    """
    Background worker task running CEO Agent execution flow and storing results in DB.
    """
    async with AsyncSessionLocal() as db:
        mission = await db.get(SearchMission, mission_id)
        if not mission:
            return

        mission.status = "IN_PROGRESS"
        await db.commit()

        try:
            results = await ceo_agent.execute_mission(mission_id, user_prompt, profile_dict)
            
            # Save jobs & matches to DB safely with savepoints
            seen_urls = set()
            for job_data in results.get("jobs", []):
                match_data = job_data.pop("match", {})
                canonical_url = job_data.get("canonical_url", "")
                
                if not canonical_url or canonical_url in seen_urls:
                    continue
                seen_urls.add(canonical_url)

                try:
                    async with db.begin_nested():
                        existing_res = await db.execute(select(Job).filter(Job.canonical_url == canonical_url))
                        job_obj = existing_res.scalars().first()
                        
                        if not job_obj:
                            job_obj = Job(
                                mission_id=mission_id,
                                canonical_url=canonical_url,
                                job_title=job_data.get("job_title", "Developer"),
                                normalized_job_title=job_data.get("normalized_job_title", "developer"),
                                company_name=job_data.get("company_name", "Tech Corp"),
                                normalized_company_name=job_data.get("normalized_company_name", "tech corp"),
                                location=job_data.get("location", "Pune"),
                                experience_required=job_data.get("experience_required", "Fresher"),
                                employment_type=job_data.get("employment_type", "Full-time"),
                                salary_range=job_data.get("salary_range"),
                                description=job_data.get("description"),
                                skills_required=job_data.get("skills_required", []),
                                posted_at=job_data.get("posted_at"),
                                source_platform=job_data.get("source_platform", "Web"),
                                all_sources=job_data.get("all_sources", []),
                                official_company_url=job_data.get("official_company_url"),
                                verification_status=job_data.get("verification_status", "VERIFIED"),
                                freshness_confidence=job_data.get("freshness_confidence", "HIGH"),
                                user_status="SAVED"
                            )
                            db.add(job_obj)
                            await db.flush()

                        if match_data and job_obj:
                            match_res = await db.execute(select(JobMatch).filter(JobMatch.job_id == job_obj.id))
                            match_obj = match_res.scalars().first()
                            if not match_obj:
                                match_obj = JobMatch(
                                    job_id=job_obj.id,
                                    match_score=match_data.get("match_score", 0.0),
                                    score_breakdown=match_data.get("score_breakdown", {}),
                                    matched_skills=match_data.get("matched_skills", []),
                                    missing_skills=match_data.get("missing_skills", []),
                                    explanation=match_data.get("explanation"),
                                    research_brief=match_data.get("research_brief")
                                )
                                db.add(match_obj)
                                await db.flush()
                except Exception as inner_e:
                    print(f"Skipped duplicate/invalid job record: {inner_e}")

            mission = await db.get(SearchMission, mission_id)
            if mission:
                mission.status = "COMPLETED"
                mission.strategy_summary = results.get("strategy_summary", "")
                mission.executive_report = results.get("executive_report", "")
                await db.commit()

            await sse_manager.broadcast(
                mission_id=mission_id,
                event_type="MISSION_COMPLETED",
                data={"status": "COMPLETED", "summary": results.get("strategy_summary", "")}
            )

        except Exception as e:
            print(f"Mission background execution error: {e}")
            await db.rollback()
            mission = await db.get(SearchMission, mission_id)
            if mission:
                mission.status = "FAILED"
                await db.commit()

            await sse_manager.broadcast(
                mission_id=mission_id,
                event_type="MISSION_COMPLETED",
                data={"status": "FAILED", "error": str(e)}
            )

@router.post("", response_model=MissionResponse)
async def create_search_mission(
    data: MissionCreate,
    background_tasks: BackgroundTasks,
    db: AsyncSession = Depends(get_db)
):
    # Fetch candidate profile
    prof_res = await db.execute(select(CandidateProfile).limit(1))
    profile = prof_res.scalars().first()
    
    profile_dict = {}
    if profile:
        profile_dict = {
            "full_name": profile.full_name,
            "skills": profile.skills or [],
            "preferred_roles": profile.preferred_roles or [],
            "preferred_locations": profile.preferred_locations or [],
            "experience_level": profile.experience_level or "Fresher",
            "resume_text": profile.resume_text
        }

    mission = SearchMission(
        profile_id=profile.id if profile else None,
        user_prompt=data.user_prompt,
        status="PENDING"
    )
    db.add(mission)
    await db.commit()

    # Eager load tasks for Pydantic response validation
    result = await db.execute(
        select(SearchMission)
        .options(selectinload(SearchMission.tasks))
        .filter(SearchMission.id == mission.id)
    )
    mission_obj = result.scalars().first()

    background_tasks.add_task(run_mission_background, mission.id, data.user_prompt, profile_dict)
    return mission_obj

@router.get("", response_model=List[MissionResponse])
async def list_search_missions(db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(SearchMission)
        .options(selectinload(SearchMission.tasks))
        .order_by(SearchMission.created_at.desc())
    )
    return result.scalars().all()

@router.get("/{mission_id}", response_model=MissionResponse)
async def get_mission(mission_id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(SearchMission)
        .options(selectinload(SearchMission.tasks))
        .filter(SearchMission.id == mission_id)
    )
    mission = result.scalars().first()
    if not mission:
        raise HTTPException(status_code=404, detail="Mission not found")
    return mission

@router.get("/{mission_id}/events")
async def stream_mission_events(mission_id: str):
    """
    SSE stream endpoint broadcasting live real-time agent updates to frontend Mission Control.
    """
    queue = await sse_manager.subscribe(mission_id)

    async def event_generator():
        try:
            while True:
                data = await queue.get()
                yield f"data: {json.dumps(data)}\n\n"
        except asyncio.CancelledError:
            sse_manager.unsubscribe(mission_id, queue)

    return StreamingResponse(event_generator(), media_type="text/event-stream")
