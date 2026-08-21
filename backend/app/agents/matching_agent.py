from typing import List, Dict, Any
from app.agents.base_agent import BaseAgent

class JobMatchingAgent(BaseAgent):
    """
    AGENT 9 — JOB MATCHING AGENT
    Calculates candidate compatibility score (0-100) using 7 configurable criteria.
    Outputs: matched skills, missing skills, score breakdown, and natural language explanation.
    """
    def __init__(self):
        super().__init__(
            agent_name="Job Matching Agent",
            agent_role="Resume Compatibility & Scoring Engine"
        )

    async def score_jobs(self, mission_id: str, task_id: str, jobs: List[Dict[str, Any]], candidate_profile: Dict[str, Any]) -> List[Dict[str, Any]]:
        await self.log_event(mission_id, "INFO", f"Scoring resume compatibility for {len(jobs)} unique jobs...")
        await self.update_task_progress(mission_id, task_id, "RUNNING", items_count=0)

        candidate_skills = set(s.lower() for s in candidate_profile.get("skills", []))
        candidate_roles = [r.lower() for r in candidate_profile.get("preferred_roles", [])]
        candidate_locations = [l.lower() for l in candidate_profile.get("preferred_locations", [])]

        scored_jobs = []

        for job in jobs:
            required_skills = job.get("skills_required", [])
            req_skills_lower = set(s.lower() for s in required_skills)

            # 1. Skills Match (30 points max)
            matched_skills_set = candidate_skills.intersection(req_skills_lower)
            missing_skills_set = req_skills_lower.difference(candidate_skills)

            matched_skills = [s for s in required_skills if s.lower() in matched_skills_set]
            missing_skills = [s for s in required_skills if s.lower() in missing_skills_set]

            if req_skills_lower:
                skills_score = round((len(matched_skills_set) / len(req_skills_lower)) * 30, 1)
            else:
                skills_score = 25.0

            # 2. Role Match (25 points max)
            title = job.get("job_title", "").lower()
            role_score = 0.0
            for r in candidate_roles:
                if r in title:
                    role_score = 25.0
                    break
                elif any(word in title for word in r.split()):
                    role_score = 18.0

            if role_score == 0.0:
                role_score = 15.0 # Baseline software engineering role overlap

            # 3. Experience Match (15 points max)
            exp_req = job.get("experience_required", "").lower()
            if "fresher" in exp_req or "0-1" in exp_req or "entry" in exp_req:
                exp_score = 15.0
            else:
                exp_score = 10.0

            # 4. Location Match (10 points max)
            loc = job.get("location", "").lower()
            if any(pref_loc in loc for pref_loc in candidate_locations):
                loc_score = 10.0
            elif "remote" in loc:
                loc_score = 10.0
            else:
                loc_score = 5.0

            # 5. Project Relevance (10 points max)
            proj_score = 8.5 if ("java" in title or "backend" in title or "sql" in title) else 7.0

            # 6. Freshness (5 points max)
            freshness_score = 5.0

            # 7. Application Ease (5 points max)
            app_ease_score = 5.0 if job.get("official_company_url") else 4.0

            # Total score
            total_score = round(skills_score + role_score + exp_score + loc_score + proj_score + freshness_score + app_ease_score, 1)
            total_score = min(100.0, max(0.0, total_score))

            # Score explanation
            explanation_parts = []
            if matched_skills:
                explanation_parts.append(f"✓ Matched key skills: {', '.join(matched_skills[:4])}")
            if missing_skills:
                explanation_parts.append(f"⚠ Missing optional skills: {', '.join(missing_skills[:3])}")
            if loc_score == 10.0:
                explanation_parts.append(f"✓ Location matches candidate preference ({job.get('location')})")
            if exp_score == 15.0:
                explanation_parts.append(f"✓ Eligible for Fresher / Entry Level")

            job["match"] = {
                "match_score": total_score,
                "score_breakdown": {
                    "skills_score": skills_score,
                    "role_score": role_score,
                    "experience_score": exp_score,
                    "location_score": loc_score,
                    "project_relevance": proj_score,
                    "freshness": freshness_score,
                    "application_ease": app_ease_score
                },
                "matched_skills": matched_skills,
                "missing_skills": missing_skills,
                "explanation": " | ".join(explanation_parts)
            }
            scored_jobs.append(job)

        # Sort jobs by highest match score descending
        scored_jobs.sort(key=lambda j: j["match"]["match_score"], reverse=True)

        highest_score = scored_jobs[0]["match"]["match_score"] if scored_jobs else 0
        await self.log_event(
            mission_id,
            "SUCCESS",
            f"Job scoring complete. Highest match score achieved: {highest_score}%"
        )
        await self.update_task_progress(mission_id, task_id, "COMPLETED", items_count=len(scored_jobs), results_summary=f"Ranked {len(scored_jobs)} jobs. Top match: {highest_score}%")
        return scored_jobs

matching_agent = JobMatchingAgent()
