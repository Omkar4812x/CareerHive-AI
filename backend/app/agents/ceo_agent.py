import asyncio
import logging
from typing import Dict, Any, List
from datetime import datetime

from app.agents.base_agent import BaseAgent
from app.agents.strategist_agent import strategist_agent
from app.agents.resume_agent import resume_agent
from app.agents.platform_scouts import (
    linkedin_scout, indeed_scout, internshala_scout, startup_scout, india_portal_scout
)
from app.agents.career_page_hunter import career_page_hunter
from app.agents.extraction_agent import extraction_agent
from app.agents.verification_agent import verification_agent
from app.agents.deduplication_agent import deduplication_agent
from app.agents.matching_agent import matching_agent
from app.agents.research_agent import research_agent
from app.agents.reporter_agent import reporter_agent

logger = logging.getLogger("CEOAgent")

class CEOCareerAgent(BaseAgent):
    """
    AGENT 1 — CEO CAREER AGENT (ORCHESTRATOR)
    Manages the multi-agent hierarchy.
    Translates user command -> task graph -> dispatches workers concurrently -> aggregates jobs -> runs extraction/verification/deduplication/matching/reporting -> delivers final report.
    """
    def __init__(self):
        super().__init__(
            agent_name="CEO Career Agent",
            agent_role="Chief Executive AI Orchestrator"
        )

    async def execute_mission(self, mission_id: str, user_prompt: str, raw_profile: Dict[str, Any]) -> Dict[str, Any]:
        await self.log_event(mission_id, "INFO", f"Mission initiated by user. CEO analyzing prompt: '{user_prompt}'")

        # Step 1: Candidate Profile Analysis (Resume Intelligence Agent)
        candidate_profile = await resume_agent.analyze_profile(mission_id, raw_profile)

        # Step 2: Search Strategy Generation (Job Search Strategist)
        strategy = await strategist_agent.create_strategy(mission_id, user_prompt, candidate_profile)
        platform_queries = strategy.get("platform_queries", {})

        # Step 3: Concurrent Platform Scouting & Company Hunting
        await self.log_event(mission_id, "INFO", "CEO dispatching specialist scout agents concurrently...")

        search_tasks = [
            linkedin_scout.execute_search(mission_id, f"{mission_id}_t_linkedin", platform_queries.get("LinkedIn", [])),
            indeed_scout.execute_search(mission_id, f"{mission_id}_t_indeed", platform_queries.get("Indeed", [])),
            internshala_scout.execute_search(mission_id, f"{mission_id}_t_internshala", platform_queries.get("Internshala", [])),
            startup_scout.execute_search(mission_id, f"{mission_id}_t_startup", platform_queries.get("Startup Portals", [])),
            india_portal_scout.execute_search(mission_id, f"{mission_id}_t_india", platform_queries.get("India Job Portals", [])),
            career_page_hunter.hunt_company_pages(mission_id, f"{mission_id}_t_hunter", strategy.get("target_roles", []), strategy.get("target_locations", []))
        ]

        # Execute concurrent tasks safely
        scout_results = await asyncio.gather(*search_tasks, return_exceptions=True)

        raw_jobs = []
        for res in scout_results:
            if isinstance(res, list):
                raw_jobs.extend(res)
            elif isinstance(res, Exception):
                await self.log_event(mission_id, "WARNING", f"Worker task encountered non-fatal error: {res}")

        total_discovered = len(raw_jobs)
        await self.log_event(mission_id, "SUCCESS", f"Phase 1 Complete: Discovered {total_discovered} raw job postings across platforms.")

        # Step 4: Job Extraction Agent
        extracted_jobs = await extraction_agent.extract_jobs(mission_id, f"{mission_id}_t_extract", raw_jobs)

        # Step 5: Verification Agent
        verified_jobs = await verification_agent.verify_jobs(mission_id, f"{mission_id}_t_verify", extracted_jobs)

        # Step 6: Deduplication Agent
        unique_jobs = await deduplication_agent.deduplicate_jobs(mission_id, f"{mission_id}_t_dedup", verified_jobs)
        duplicates_removed = len(verified_jobs) - len(unique_jobs)

        # Step 7: Job Matching Agent (0-100 Compatibility Score)
        scored_jobs = await matching_agent.score_jobs(mission_id, f"{mission_id}_t_match", unique_jobs, candidate_profile)

        # Step 8: Opportunity Research Agent
        researched_jobs = await research_agent.research_top_jobs(mission_id, f"{mission_id}_t_research", scored_jobs, top_n=5)

        # Step 9: Career Reporter Agent
        exec_report = await reporter_agent.generate_report(
            mission_id=mission_id,
            task_id=f"{mission_id}_t_report",
            total_discovered=total_discovered,
            duplicates_removed=duplicates_removed,
            verified_jobs=researched_jobs,
            platforms_searched=strategy.get("target_platforms", [])
        )

        await self.log_event(mission_id, "SUCCESS", "🎉 MISSION COMPLETE! Executive summary report generated and delivered.")

        return {
            "status": "COMPLETED",
            "total_discovered": total_discovered,
            "duplicates_removed": duplicates_removed,
            "unique_jobs_count": len(researched_jobs),
            "jobs": researched_jobs,
            "executive_report": exec_report,
            "strategy_summary": strategy.get("summary", "")
        }

ceo_agent = CEOCareerAgent()
