from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List, Optional

from app.database import get_db
from app.models import AgentLog
from app.schemas import AgentLogResponse

router = APIRouter(prefix="/api/agents", tags=["Agent Management & Logs"])

AGENT_REGISTRY = [
    {"id": "agent-1", "name": "CEO Career Agent", "role": "Orchestrator & Strategy Manager", "status": "READY"},
    {"id": "agent-2", "name": "Job Search Strategist", "role": "Query Expansion & Role Variation", "status": "READY"},
    {"id": "agent-3", "name": "Resume Intelligence Agent", "role": "Candidate Profile Parser", "status": "READY"},
    {"id": "agent-4a", "name": "LinkedIn Job Scout", "role": "LinkedIn Platform Worker", "status": "READY"},
    {"id": "agent-4b", "name": "Indeed Job Scout", "role": "Indeed Platform Worker", "status": "READY"},
    {"id": "agent-4c", "name": "Internshala & Fresher Scout", "role": "Fresher Opportunities Worker", "status": "READY"},
    {"id": "agent-4d", "name": "Startup Job Scout", "role": "Wellfound / Instahyre Worker", "status": "READY"},
    {"id": "agent-4e", "name": "India Job Portal Scout", "role": "Shine / Foundit / Apna Worker", "status": "READY"},
    {"id": "agent-5", "name": "Company Career Hunter", "role": "Official Portal Discovery", "status": "READY"},
    {"id": "agent-6", "name": "Job Extraction Agent", "role": "Structured Schema Extractor", "status": "READY"},
    {"id": "agent-7", "name": "Job Verification Agent", "role": "URL & Status Verifier", "status": "READY"},
    {"id": "agent-8", "name": "Deduplication Agent", "role": "Cross-Platform Deduplicator", "status": "READY"},
    {"id": "agent-9", "name": "Job Matching Agent", "role": "0-100 Compatibility Matcher", "status": "READY"},
    {"id": "agent-10", "name": "Opportunity Researcher", "role": "Company Intelligence Briefs", "status": "READY"},
    {"id": "agent-11", "name": "Career Reporter Agent", "role": "Executive Report Generator", "status": "READY"}
]

@router.get("")
async def list_agents():
    return AGENT_REGISTRY

@router.get("/logs", response_model=List[AgentLogResponse])
async def list_agent_logs(mission_id: Optional[str] = None, db: AsyncSession = Depends(get_db)):
    query = select(AgentLog).order_by(AgentLog.timestamp.desc()).limit(100)
    if mission_id:
        query = query.filter(AgentLog.mission_id == mission_id)
    result = await db.execute(query)
    return result.scalars().all()
