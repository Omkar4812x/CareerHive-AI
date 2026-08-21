from typing import List, Dict, Any
from app.agents.base_agent import BaseAgent

class JobSearchStrategistAgent(BaseAgent):
    """
    AGENT 2 — JOB SEARCH STRATEGIST
    Converts vague user prompts into precise, multi-platform search strategies.
    Generates role variations, tech keywords, and optimized search queries.
    """
    def __init__(self):
        super().__init__(
            agent_name="Job Search Strategist",
            agent_role="Search Strategy & Keyword Specialist"
        )

    async def create_strategy(self, mission_id: str, user_prompt: str, candidate_profile: Dict[str, Any]) -> Dict[str, Any]:
        await self.log_event(mission_id, "INFO", f"Analyzing command and expanding search strategy for: '{user_prompt}'")

        # Extract roles from prompt or profile
        base_roles = candidate_profile.get("preferred_roles", ["Java Developer", "Software Developer"])
        locations = candidate_profile.get("preferred_locations", ["Pune", "Hyderabad", "Bangalore"])

        # Expand role variations
        expanded_roles = set(base_roles)
        for role in list(base_roles):
            if "Java" in role:
                expanded_roles.update([
                    "Java Developer", "Junior Java Developer", "Java Backend Developer",
                    "Associate Software Engineer Java", "Java Full Stack Developer",
                    "Spring Boot Developer", "Fresher Java Developer"
                ])
            if "Backend" in role or "Developer" in role:
                expanded_roles.update([
                    "Backend Developer", "Software Developer", "SQL Developer",
                    "Graduate Engineer Trainee", "Software Engineer"
                ])

        role_list = list(expanded_roles)[:8]

        # Platforms to target
        target_platforms = [
            "LinkedIn", "Indeed", "Internshala", "Startup Portals", "India Job Portals", "Company Careers"
        ]

        # Generate targeted queries per platform
        platform_queries = {}
        for platform in target_platforms:
            queries = []
            for role in role_list[:3]:
                for loc in locations[:2]:
                    if platform == "LinkedIn":
                        queries.append(f"site:linkedin.com/jobs {role} {loc} fresher")
                    elif platform == "Indeed":
                        queries.append(f"{role} jobs in {loc} 0-1 years")
                    elif platform == "Internshala":
                        queries.append(f"{role} internship jobs {loc}")
                    elif platform == "Startup Portals":
                        queries.append(f"{role} startup jobs {loc} India")
                    elif platform == "Company Careers":
                        queries.append(f"{role} jobs {loc} careers official site")
                    else:
                        queries.append(f"{role} {loc} active hiring 2026")
            platform_queries[platform] = queries[:4]

        strategy = {
            "target_roles": role_list,
            "target_locations": locations,
            "posted_within_hours": 48,
            "target_platforms": target_platforms,
            "platform_queries": platform_queries,
            "summary": f"Expanded {len(base_roles)} requested roles into {len(role_list)} targeted variations across {len(target_platforms)} platform channels in {', '.join(locations)}."
        }

        await self.log_event(mission_id, "SUCCESS", f"Search strategy generated. Target roles: {', '.join(role_list[:4])}...")
        return strategy

strategist_agent = JobSearchStrategistAgent()
