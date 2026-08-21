from typing import Dict, Any
from app.agents.base_agent import BaseAgent
from app.services.resume_parser import resume_parser

class ResumeIntelligenceAgent(BaseAgent):
    """
    AGENT 3 — RESUME INTELLIGENCE AGENT
    Extracts skills, languages, experience level, education, and portfolio links from candidate context.
    """
    def __init__(self):
        super().__init__(
            agent_name="Resume Intelligence Agent",
            agent_role="Candidate Skill & Resume Analyst"
        )

    async def analyze_profile(self, mission_id: str, profile_data: Dict[str, Any]) -> Dict[str, Any]:
        await self.log_event(mission_id, "INFO", "Reading candidate profile and analyzing skills matrix...")

        raw_resume = profile_data.get("resume_text", "")
        if raw_resume:
            parsed = resume_parser.parse_resume(raw_resume)
            # Merge with explicitly specified preferences
            skills = list(set(profile_data.get("skills", []) + parsed["skills"]))
            roles = list(set(profile_data.get("preferred_roles", []) + parsed["preferred_roles"]))
            locations = profile_data.get("preferred_locations", parsed["preferred_locations"])
        else:
            skills = profile_data.get("skills", ["Java", "SQL", "MySQL", "HTML", "CSS", "JavaScript", "Git", "GitHub"])
            roles = profile_data.get("preferred_roles", ["Java Developer", "Junior Java Developer", "Backend Developer", "SQL Developer"])
            locations = profile_data.get("preferred_locations", ["Pune", "Hyderabad", "Bangalore"])

        candidate_profile = {
            "full_name": profile_data.get("full_name", "Candidate"),
            "skills": skills,
            "experience_level": profile_data.get("experience_level", "Fresher"),
            "preferred_roles": roles,
            "preferred_locations": locations,
            "github_url": profile_data.get("github_url", "https://github.com/candidate"),
            "portfolio_url": profile_data.get("portfolio_url", "https://candidate.dev")
        }

        await self.log_event(
            mission_id,
            "SUCCESS",
            f"Candidate profile initialized: {len(skills)} skills detected ({', '.join(skills[:5])}...), Experience: {candidate_profile['experience_level']}"
        )
        return candidate_profile

resume_agent = ResumeIntelligenceAgent()
