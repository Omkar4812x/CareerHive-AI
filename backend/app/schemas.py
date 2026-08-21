from datetime import datetime
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

# Profile Schemas
class ProfileBase(BaseModel):
    full_name: str = "Candidate"
    email: Optional[str] = None
    phone: Optional[str] = None
    location: Optional[str] = "Pune, India"
    experience_level: str = "Fresher"
    skills: List[str] = Field(default_factory=list)
    preferred_roles: List[str] = Field(default_factory=list)
    preferred_locations: List[str] = Field(default_factory=list)
    salary_expectation: Optional[str] = None
    github_url: Optional[str] = None
    portfolio_url: Optional[str] = None
    resume_text: Optional[str] = None

class ProfileCreate(ProfileBase):
    pass

class ProfileResponse(ProfileBase):
    id: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# Mission Schemas
class MissionCreate(BaseModel):
    user_prompt: str
    profile_id: Optional[str] = None

class AgentTaskResponse(BaseModel):
    id: str
    agent_name: str
    task_type: str
    platform: Optional[str] = None
    status: str
    payload: Dict[str, Any] = Field(default_factory=dict)
    results_summary: Optional[str] = None
    items_count: int = 0
    error_message: Optional[str] = None
    updated_at: datetime

    class Config:
        from_attributes = True

class MissionResponse(BaseModel):
    id: str
    profile_id: Optional[str] = None
    user_prompt: str
    status: str
    strategy_summary: Optional[str] = None
    executive_report: Optional[str] = None
    created_at: datetime
    completed_at: Optional[datetime] = None
    tasks: List[AgentTaskResponse] = Field(default_factory=list)

    class Config:
        from_attributes = True

# Job Schemas
class JobMatchResponse(BaseModel):
    id: str
    match_score: float
    score_breakdown: Dict[str, Any] = Field(default_factory=dict)
    matched_skills: List[str] = Field(default_factory=list)
    missing_skills: List[str] = Field(default_factory=list)
    explanation: Optional[str] = None
    research_brief: Optional[str] = None

    class Config:
        from_attributes = True

class JobResponse(BaseModel):
    id: str
    mission_id: Optional[str] = None
    canonical_url: str
    job_title: str
    company_name: str
    location: str
    experience_required: str
    employment_type: str
    salary_range: Optional[str] = None
    description: Optional[str] = None
    skills_required: List[str] = Field(default_factory=list)
    posted_at: Optional[str] = None
    source_platform: str
    all_sources: List[str] = Field(default_factory=list)
    official_company_url: Optional[str] = None
    verification_status: str
    freshness_confidence: str
    user_status: str
    match: Optional[JobMatchResponse] = None
    created_at: datetime

    class Config:
        from_attributes = True

class JobStatusUpdate(BaseModel):
    user_status: str # SAVED, INTERESTED, APPLIED, INTERVIEW, REJECTED, OFFER, NOT_INTERESTED

# Agent Log Schema
class AgentLogResponse(BaseModel):
    id: str
    mission_id: Optional[str] = None
    agent_name: str
    log_level: str
    message: str
    details: Optional[Dict[str, Any]] = None
    timestamp: datetime

    class Config:
        from_attributes = True
