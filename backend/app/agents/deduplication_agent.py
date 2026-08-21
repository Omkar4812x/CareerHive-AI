import re
from typing import List, Dict, Any
from app.agents.base_agent import BaseAgent

class DeduplicationAgent(BaseAgent):
    """
    AGENT 8 — DEDUPLICATION AGENT
    Merges duplicate job listings found across multiple platforms.
    Normalizes titles, company names, locations, and keeps the official company URL as master.
    """
    def __init__(self):
        super().__init__(
            agent_name="Deduplication Agent",
            agent_role="Cross-Platform Deduplicator & Merger"
        )

    def _normalize(self, text: str) -> str:
        text = text.lower().strip()
        text = re.sub(r'[^a-z0-9\s]', '', text)
        return text

    async def deduplicate_jobs(self, mission_id: str, task_id: str, jobs: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        await self.log_event(mission_id, "INFO", f"Scanning {len(jobs)} jobs for cross-platform duplicates...")
        await self.update_task_progress(mission_id, task_id, "RUNNING", items_count=0)

        master_jobs: Dict[str, Dict[str, Any]] = {}
        duplicates_removed = 0

        for job in jobs:
            norm_title = self._normalize(job.get("job_title", ""))
            norm_company = self._normalize(job.get("company_name", ""))
            norm_loc = self._normalize(job.get("location", ""))

            # Unique key combining normalized title, company, location
            dedup_key = f"{norm_company}::{norm_title}::{norm_loc}"

            if dedup_key in master_jobs:
                duplicates_removed += 1
                existing = master_jobs[dedup_key]

                # Append platform source if unique
                source = job.get("source_platform", "Web")
                if source not in existing["all_sources"]:
                    existing["all_sources"].append(source)

                # Prioritize official company URL if discovered
                if job.get("official_company_url") and not existing.get("official_company_url"):
                    existing["official_company_url"] = job.get("official_company_url")
                    existing["canonical_url"] = job.get("official_company_url")
                    existing["source_platform"] = "Official Company Website"

                # Merge skills
                merged_skills = list(set(existing.get("skills_required", []) + job.get("skills_required", [])))
                existing["skills_required"] = merged_skills
            else:
                job["normalized_job_title"] = norm_title
                job["normalized_company_name"] = norm_company
                if "all_sources" not in job or not job["all_sources"]:
                    job["all_sources"] = [job.get("source_platform", "Web")]
                master_jobs[dedup_key] = job

        unique_list = list(master_jobs.values())

        await self.log_event(
            mission_id,
            "SUCCESS",
            f"Deduplication complete: {duplicates_removed} duplicate listings merged. {len(unique_list)} unique opportunities remaining."
        )
        await self.update_task_progress(mission_id, task_id, "COMPLETED", items_count=len(unique_list), results_summary=f"Removed {duplicates_removed} duplicates")
        return unique_list

deduplication_agent = DeduplicationAgent()
