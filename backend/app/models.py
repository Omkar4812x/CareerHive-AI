import uuid
from datetime import datetime
from sqlalchemy import Column, String, Integer, Float, Text, Boolean, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from app.database import Base

def generate_uuid():
    return str(uuid.uuid4())

class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, default=generate_uuid)
    email = Column(String, unique=True, index=True, nullable=False)
    full_name = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    profiles = relationship("CandidateProfile", back_populates="user")

class CandidateProfile(Base):
    __tablename__ = "candidate_profiles"

    id = Column(String, primary_key=True, default=generate_uuid)
    user_id = Column(String, ForeignKey("users.id"), nullable=True)
    full_name = Column(String, nullable=False, default="Candidate")
    email = Column(String, nullable=True)
    phone = Column(String, nullable=True)
    location = Column(String, nullable=True)
    experience_level = Column(String, default="Fresher") # Fresher, 0-1 years, 1-3 years, Senior
    skills = Column(JSON, default=list) # ["Java", "SQL", ...]
    preferred_roles = Column(JSON, default=list) # ["Java Developer", ...]
    preferred_locations = Column(JSON, default=list) # ["Pune", "Hyderabad", ...]
    salary_expectation = Column(String, nullable=True)
    github_url = Column(String, nullable=True)
    portfolio_url = Column(String, nullable=True)
    resume_text = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = relationship("User", back_populates="profiles")
    missions = relationship("SearchMission", back_populates="profile")

class Resume(Base):
    __tablename__ = "resumes"

    id = Column(String, primary_key=True, default=generate_uuid)
    filename = Column(String, nullable=False)
    content_type = Column(String, nullable=False)
    raw_text = Column(Text, nullable=False)
    parsed_skills = Column(JSON, default=list)
    parsed_experience = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class SearchMission(Base):
    __tablename__ = "search_missions"

    id = Column(String, primary_key=True, default=generate_uuid)
    profile_id = Column(String, ForeignKey("candidate_profiles.id"), nullable=True)
    user_prompt = Column(Text, nullable=False)
    status = Column(String, default="PENDING") # PENDING, IN_PROGRESS, COMPLETED, PARTIALLY_COMPLETED, FAILED
    strategy_summary = Column(Text, nullable=True)
    executive_report = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    completed_at = Column(DateTime, nullable=True)

    profile = relationship("CandidateProfile", back_populates="missions")
    tasks = relationship("AgentTask", back_populates="mission", cascade="all, delete-orphan")
    jobs = relationship("Job", back_populates="mission")

class AgentTask(Base):
    __tablename__ = "agent_tasks"

    id = Column(String, primary_key=True, default=generate_uuid)
    mission_id = Column(String, ForeignKey("search_missions.id"), nullable=False)
    agent_name = Column(String, nullable=False) # CEO, Strategist, Scout_LinkedIn, Hunter, etc.
    task_type = Column(String, nullable=False)
    platform = Column(String, nullable=True)
    status = Column(String, default="PENDING") # PENDING, RUNNING, COMPLETED, FAILED, RETRYING
    payload = Column(JSON, default=dict)
    results_summary = Column(Text, nullable=True)
    items_count = Column(Integer, default=0)
    error_message = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    mission = relationship("SearchMission", back_populates="tasks")

class Job(Base):
    __tablename__ = "jobs"

    id = Column(String, primary_key=True, default=generate_uuid)
    mission_id = Column(String, ForeignKey("search_missions.id"), nullable=True)
    canonical_url = Column(Text, nullable=False, unique=True)
    job_title = Column(String, nullable=False)
    normalized_job_title = Column(String, nullable=False, index=True)
    company_name = Column(String, nullable=False)
    normalized_company_name = Column(String, nullable=False, index=True)
    location = Column(String, nullable=False)
    experience_min = Column(Integer, default=0)
    experience_max = Column(Integer, default=5)
    experience_required = Column(String, default="Fresher / 0-1 years")
    employment_type = Column(String, default="Full-time")
    salary_range = Column(String, nullable=True)
    currency = Column(String, default="INR")
    description = Column(Text, nullable=True)
    skills_required = Column(JSON, default=list)
    posted_at = Column(String, nullable=True)
    discovered_at = Column(DateTime, default=datetime.utcnow)
    source_platform = Column(String, nullable=False) # LinkedIn, Indeed, Company Career Page, etc.
    all_sources = Column(JSON, default=list) # List of platforms/urls where job was found
    official_company_url = Column(Text, nullable=True)
    verification_status = Column(String, default="UNVERIFIED") # VERIFIED, LIKELY_ACTIVE, UNVERIFIED, EXPIRED, BROKEN
    freshness_confidence = Column(String, default="MEDIUM") # HIGH, MEDIUM, LOW
    user_status = Column(String, default="SAVED") # SAVED, INTERESTED, APPLIED, INTERVIEW, REJECTED, OFFER, NOT_INTERESTED
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    mission = relationship("SearchMission", back_populates="jobs")
    match = relationship("JobMatch", back_populates="job", uselist=False, cascade="all, delete-orphan")

class JobMatch(Base):
    __tablename__ = "job_matches"

    id = Column(String, primary_key=True, default=generate_uuid)
    job_id = Column(String, ForeignKey("jobs.id"), nullable=False, unique=True)
    match_score = Column(Float, nullable=False, default=0.0) # 0 to 100
    score_breakdown = Column(JSON, default=dict) # { "skills_score": 30, "role_score": 25, ... }
    matched_skills = Column(JSON, default=list)
    missing_skills = Column(JSON, default=list)
    explanation = Column(Text, nullable=True)
    research_brief = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    job = relationship("Job", back_populates="match")

class AgentLog(Base):
    __tablename__ = "agent_logs"

    id = Column(String, primary_key=True, default=generate_uuid)
    mission_id = Column(String, nullable=True, index=True)
    agent_name = Column(String, nullable=False, index=True)
    log_level = Column(String, default="INFO")
    message = Column(Text, nullable=False)
    details = Column(JSON, nullable=True)
    timestamp = Column(DateTime, default=datetime.utcnow)
