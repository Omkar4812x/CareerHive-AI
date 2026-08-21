import { CandidateProfile, SearchMission, Job, AgentLog, JobUserStatus } from '../types';

const API_BASE = '/api';

export const api = {
  // Candidate Profile
  async getProfile(): Promise<CandidateProfile> {
    const res = await fetch(`${API_BASE}/profile`);
    if (!res.ok) throw new Error('Failed to fetch profile');
    return res.json();
  },

  async updateProfile(data: Partial<CandidateProfile>): Promise<CandidateProfile> {
    const res = await fetch(`${API_BASE}/profile`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to update profile');
    return res.json();
  },

  async uploadResume(file: File): Promise<{ profile: CandidateProfile }> {
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch(`${API_BASE}/profile/upload-resume`, {
      method: 'POST',
      body: formData
    });
    if (!res.ok) throw new Error('Failed to upload resume');
    return res.json();
  },

  // Search Missions
  async createMission(user_prompt: string): Promise<SearchMission> {
    const res = await fetch(`${API_BASE}/missions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_prompt })
    });
    if (!res.ok) throw new Error('Failed to create mission');
    return res.json();
  },

  async getMissions(): Promise<SearchMission[]> {
    const res = await fetch(`${API_BASE}/missions`);
    if (!res.ok) throw new Error('Failed to fetch missions');
    return res.json();
  },

  async getMission(id: string): Promise<SearchMission> {
    const res = await fetch(`${API_BASE}/missions/${id}`);
    if (!res.ok) throw new Error('Failed to fetch mission');
    return res.json();
  },

  // Jobs
  async getJobs(filters?: {
    mission_id?: string;
    min_match_score?: number;
    location?: string;
    role?: string;
    platform?: string;
    verification_status?: string;
    user_status?: string;
  }): Promise<Job[]> {
    const query = new URLSearchParams();
    if (filters?.mission_id) query.append('mission_id', filters.mission_id);
    if (filters?.min_match_score) query.append('min_match_score', filters.min_match_score.toString());
    if (filters?.location) query.append('location', filters.location);
    if (filters?.role) query.append('role', filters.role);
    if (filters?.platform) query.append('platform', filters.platform);
    if (filters?.verification_status) query.append('verification_status', filters.verification_status);
    if (filters?.user_status) query.append('user_status', filters.user_status);

    const res = await fetch(`${API_BASE}/jobs?${query.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch jobs');
    return res.json();
  },

  async updateJobStatus(job_id: string, user_status: JobUserStatus): Promise<void> {
    const res = await fetch(`${API_BASE}/jobs/${job_id}/apply-status`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_status })
    });
    if (!res.ok) throw new Error('Failed to update job status');
  },

  // Agent Logs & Registry
  async getAgentLogs(mission_id?: string): Promise<AgentLog[]> {
    const url = mission_id ? `${API_BASE}/agents/logs?mission_id=${mission_id}` : `${API_BASE}/agents/logs`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch logs');
    return res.json();
  }
};
