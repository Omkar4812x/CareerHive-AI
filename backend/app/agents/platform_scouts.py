import asyncio
from typing import List, Dict, Any
from app.agents.base_agent import BaseAgent
from app.services.tinyfish_service import tinyfish_service

class PlatformScoutAgent(BaseAgent):
    """
    AGENT 4 — PLATFORM SEARCH SCOUT WORKER
    Searches specific platforms using TinyFish Search API.
    """
    def __init__(self, platform_name: str, scout_title: str):
        super().__init__(
            agent_name=scout_title,
            agent_role=f"{platform_name} Discovery Specialist"
        )
        self.platform_name = platform_name

    async def execute_search(self, mission_id: str, task_id: str, queries: List[str], max_results: int = 4) -> List[Dict[str, Any]]:
        await self.log_event(mission_id, "INFO", f"Scanning {self.platform_name} with {len(queries)} target queries...")
        await self.update_task_progress(mission_id, task_id, "RUNNING", items_count=0)

        async def fetch_query(q: str):
            try:
                res = await tinyfish_service.search_web(query=q, platform=self.platform_name, max_results=max_results)
                for r in res:
                    r["scouted_by"] = self.agent_name
                return res
            except Exception as e:
                return []

        results_lists = await asyncio.gather(*[fetch_query(q) for q in queries], return_exceptions=True)

        discovered_jobs = []
        for res in results_lists:
            if isinstance(res, list):
                discovered_jobs.extend(res)

        await self.log_event(mission_id, "SUCCESS", f"Scout completed. Discovered {len(discovered_jobs)} raw postings on {self.platform_name}.")
        await self.update_task_progress(mission_id, task_id, "COMPLETED", items_count=len(discovered_jobs), results_summary=f"Found {len(discovered_jobs)} postings")
        return discovered_jobs

# Pre-instantiated Worker Pool
linkedin_scout = PlatformScoutAgent("LinkedIn", "LinkedIn Job Scout")
indeed_scout = PlatformScoutAgent("Indeed", "Indeed Job Scout")
internshala_scout = PlatformScoutAgent("Internshala", "Internshala & Fresher Scout")
startup_scout = PlatformScoutAgent("Startup Portals", "Startup Job Scout (Wellfound/Instahyre/Cuvette)")
india_portal_scout = PlatformScoutAgent("India Job Portals", "India Job Portal Scout (Shine/Foundit/Apna/Freshersworld)")
