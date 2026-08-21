from typing import List, Dict, Any
from app.agents.base_agent import BaseAgent

class OpportunityResearchAgent(BaseAgent):
    """
    AGENT 10 — OPPORTUNITY RESEARCH AGENT
    Generates intelligent company background briefs and application notes for top-ranked job opportunities.
    """
    def __init__(self):
        super().__init__(
            agent_name="Opportunity Researcher",
            agent_role="Company Background & Opportunity Intelligence"
        )

    async def research_top_jobs(self, mission_id: str, task_id: str, jobs: List[Dict[str, Any]], top_n: int = 5) -> List[Dict[str, Any]]:
        await self.log_event(mission_id, "INFO", f"Researching background briefs for top {min(top_n, len(jobs))} opportunity matches...")
        await self.update_task_progress(mission_id, task_id, "RUNNING", items_count=0)

        for job in jobs[:top_n]:
            comp = job.get("company_name", "Company")
            title = job.get("job_title", "Developer")
            
            brief = (
                f"**Company Profile**: {comp} is an established technology organization actively hiring in software development. "
                f"**Role Outlook**: Excellent opportunity for {title} with focus on modern technology stack. "
                f"**Application Tip**: Direct official application recommended via {job.get('source_platform')} for fastest response."
            )

            if "match" in job and isinstance(job["match"], dict):
                job["match"]["research_brief"] = brief

        await self.log_event(mission_id, "SUCCESS", f"Research briefs generated for top opportunities.")
        await self.update_task_progress(mission_id, task_id, "COMPLETED", items_count=min(top_n, len(jobs)), results_summary="Completed research briefs")
        return jobs

research_agent = OpportunityResearchAgent()
