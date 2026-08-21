export interface CandidateProfile {
  id: string;
  full_name: string;
  email?: string;
  phone?: string;
  location?: string;
  experience_level: string;
  skills: string[];
  preferred_roles: string[];
  preferred_locations: string[];
  salary_expectation?: string;
  github_url?: string;
  portfolio_url?: string;
  resume_text?: string;
}

export interface ScoreBreakdown {
  skills_score: number;
  role_score: number;
  experience_score: number;
  location_score: number;
  project_relevance: number;
  freshness: number;
  application_ease: number;
}

export interface JobMatch {
  id: string;
  match_score: number;
  score_breakdown: ScoreBreakdown;
  matched_skills: string[];
  missing_skills: string[];
  explanation?: string;
  research_brief?: string;
}

export type JobUserStatus = 'SAVED' | 'INTERESTED' | 'APPLIED' | 'INTERVIEW' | 'REJECTED' | 'OFFER' | 'NOT_INTERESTED';

export interface Job {
  id: string;
  mission_id?: string;
  canonical_url: string;
  job_title: string;
  company_name: string;
  location: string;
  experience_required: string;
  employment_type: string;
  salary_range?: string;
  description?: string;
  skills_required: string[];
  posted_at?: string;
  source_platform: string;
  all_sources: string[];
  official_company_url?: string;
  verification_status: 'VERIFIED' | 'LIKELY_ACTIVE' | 'UNVERIFIED' | 'EXPIRED' | 'BROKEN';
  freshness_confidence: string;
  user_status: JobUserStatus;
  match?: JobMatch;
  created_at: string;
}

export interface AgentTask {
  id: string;
  agent_name: string;
  task_type: string;
  platform?: string;
  status: 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED' | 'RETRYING';
  payload: Record<string, any>;
  results_summary?: string;
  items_count: number;
  error_message?: string;
  updated_at: string;
}

export interface SearchMission {
  id: string;
  profile_id?: string;
  user_prompt: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'PARTIALLY_COMPLETED' | 'FAILED';
  strategy_summary?: string;
  executive_report?: string;
  created_at: string;
  completed_at?: string;
  tasks: AgentTask[];
}

export interface AgentLog {
  id: string;
  mission_id?: string;
  agent_name: string;
  agent_role?: string;
  log_level: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR' | 'DEBUG';
  message: string;
  details?: Record<string, any>;
  timestamp: string;
}
