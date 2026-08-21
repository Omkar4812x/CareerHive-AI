from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from typing import List, Optional

from app.database import get_db
from app.models import Job, JobMatch
from app.schemas import JobResponse, JobStatusUpdate

router = APIRouter(prefix="/api/jobs", tags=["Job Explorer"])

@router.get("", response_model=List[JobResponse])
async def list_jobs(
    mission_id: Optional[str] = None,
    min_match_score: Optional[float] = Query(0.0, ge=0.0, le=100.0),
    location: Optional[str] = None,
    role: Optional[str] = None,
    platform: Optional[str] = None,
    verification_status: Optional[str] = None,
    user_status: Optional[str] = None,
    db: AsyncSession = Depends(get_db)
):
    query = select(Job).options(selectinload(Job.match)).order_by(Job.created_at.desc())

    if mission_id:
        query = query.filter(Job.mission_id == mission_id)
    if location:
        query = query.filter(Job.location.ilike(f"%{location}%"))
    if role:
        query = query.filter(Job.job_title.ilike(f"%{role}%"))
    if platform:
        query = query.filter(Job.source_platform.ilike(f"%{platform}%"))
    if verification_status:
        query = query.filter(Job.verification_status == verification_status)
    if user_status:
        query = query.filter(Job.user_status == user_status)

    result = await db.execute(query)
    jobs = result.scalars().all()

    # Filter by min_match_score if specified
    if min_match_score > 0.0:
        jobs = [j for j in jobs if j.match and j.match.match_score >= min_match_score]

    # Sort by match score descending
    jobs.sort(key=lambda j: j.match.match_score if j.match else 0.0, reverse=True)

    return jobs

@router.get("/{job_id}", response_model=JobResponse)
async def get_job_detail(job_id: str, db: AsyncSession = Depends(get_db)):
    query = select(Job).options(selectinload(Job.match)).filter(Job.id == job_id)
    result = await db.execute(query)
    job = result.scalars().first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    return job

@router.post("/{job_id}/save")
async def save_job(job_id: str, db: AsyncSession = Depends(get_db)):
    job = await db.get(Job, job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    job.user_status = "SAVED"
    await db.commit()
    return {"message": "Job saved successfully"}

@router.post("/{job_id}/apply-status")
async def update_apply_status(job_id: str, data: JobStatusUpdate, db: AsyncSession = Depends(get_db)):
    job = await db.get(Job, job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    job.user_status = data.user_status
    await db.commit()
    return {"message": f"Job status updated to {data.user_status}"}
