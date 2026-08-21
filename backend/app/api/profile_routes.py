from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import Optional
import json

from app.database import get_db
from app.models import CandidateProfile, Resume
from app.schemas import ProfileCreate, ProfileResponse
from app.services.resume_parser import resume_parser

router = APIRouter(prefix="/api/profile", tags=["Candidate Profile"])

@router.get("", response_model=ProfileResponse)
async def get_candidate_profile(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(CandidateProfile).limit(1))
    profile = result.scalars().first()
    if not profile:
        profile = CandidateProfile(
            full_name="Alex Mercer",
            email="alex.mercer@example.com",
            phone="+91 98765 43210",
            location="Pune, India",
            experience_level="Fresher",
            skills=["Java", "Spring Boot", "SQL", "MySQL", "HTML", "CSS", "JavaScript", "Git", "GitHub"],
            preferred_roles=["Java Developer", "Junior Java Developer", "Backend Developer", "SQL Developer", "Software Developer"],
            preferred_locations=["Pune", "Hyderabad", "Bangalore"],
            salary_expectation="₹5,00,000 - ₹8,00,000 PA",
            github_url="https://github.com/alex-mercer",
            portfolio_url="https://alexmercer.dev"
        )
        db.add(profile)
        await db.commit()
        await db.refresh(profile)
    return profile

@router.post("", response_model=ProfileResponse)
async def update_candidate_profile(data: ProfileCreate, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(CandidateProfile).limit(1))
    profile = result.scalars().first()
    if not profile:
        profile = CandidateProfile()
        db.add(profile)

    for key, value in data.dict(exclude_unset=True).items():
        setattr(profile, key, value)

    await db.commit()
    await db.refresh(profile)
    return profile

@router.post("/upload-resume")
async def upload_resume(file: UploadFile = File(...), db: AsyncSession = Depends(get_db)):
    contents = await file.read()
    if file.filename.endswith(".pdf"):
        extracted_text = resume_parser.extract_text_from_pdf(contents)
    else:
        extracted_text = contents.decode("utf-8", errors="ignore")

    parsed = resume_parser.parse_resume(extracted_text)

    # Save resume record
    resume = Resume(
        filename=file.filename,
        content_type=file.content_type,
        raw_text=extracted_text,
        parsed_skills=parsed["skills"],
        parsed_experience=parsed["experience_level"]
    )
    db.add(resume)

    # Update candidate profile with parsed fields
    result = await db.execute(select(CandidateProfile).limit(1))
    profile = result.scalars().first()
    if not profile:
        profile = CandidateProfile()
        db.add(profile)

    profile.skills = list(set(parsed["skills"]))
    profile.experience_level = parsed["experience_level"]
    profile.resume_text = extracted_text
    
    if parsed.get("full_name"):
        profile.full_name = parsed["full_name"]
    if parsed.get("email"):
        profile.email = parsed["email"]
    if parsed.get("phone"):
        profile.phone = parsed["phone"]
    if parsed.get("preferred_roles"):
        profile.preferred_roles = parsed["preferred_roles"]
    if parsed.get("github_url"):
        profile.github_url = parsed["github_url"]
    if parsed.get("portfolio_url"):
        profile.portfolio_url = parsed["portfolio_url"]

    await db.commit()
    await db.refresh(profile)

    return {
        "message": "Resume uploaded and parsed successfully",
        "parsed_data": parsed,
        "profile": ProfileResponse.from_orm(profile)
    }
