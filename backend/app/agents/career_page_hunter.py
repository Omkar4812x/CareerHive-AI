from typing import List, Dict, Any
from app.agents.base_agent import BaseAgent
from app.services.tinyfish_service import tinyfish_service

class CompanyCareerPageHunter(BaseAgent):
    """
    AGENT 5 — COMPANY CAREER PAGE HUNTER
    Searches specifically for official company career portals to bypass third-party board noise.
    """
    def __init__(self):
        super().__init__(
            agent_name="Company Career Hunter",
            agent_role="Official Company Portal Discovery Specialist"
        )

    async def hunt_company_pages(self, mission_id: str, task_id: str, roles: List[str], locations: List[str]) -> List[Dict[str, Any]]:
        await self.log_event(mission_id, "INFO", "Hunting official company career pages for direct applications...")
        await self.update_task_progress(mission_id, task_id, "RUNNING", items_count=0)

        target_role = roles[0] if roles else "Java Developer"
        target_loc = locations[0] if locations else "Pune"

        queries = [
            f"{target_role} jobs {target_loc} careers official site",
            f"hiring {target_role} {target_loc} company careers page"
        ]

        discovered_jobs = []
        for q in queries:
            results = await tinyfish_service.search_web(query=q, platform="Company Careers", max_results=4)
            for r in results:
                r["scouted_by"] = self.agent_name
                r["is_official_company_site"] = True
            discovered_jobs.extend(results)

        await self.log_event(mission_id, "SUCCESS", f"Hunter completed. Found {len(discovered_jobs)} official company portal openings.")
        await self.update_task_progress(mission_id, task_id, "COMPLETED", items_count=len(discovered_jobs), results_summary=f"Found {len(discovered_jobs)} company portal links")
        return discovered_jobs

career_page_hunter = CompanyCareerPageHunter()
