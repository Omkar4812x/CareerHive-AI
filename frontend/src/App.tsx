import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { MissionControl } from './components/MissionControl';
import { CandidateProfileView } from './components/CandidateProfile';
import { JobExplorer } from './components/JobExplorer';
import { JobDetailModal } from './components/JobDetailModal';
import { SearchHistory } from './components/SearchHistory';
import { AgentLogViewer } from './components/AgentLogViewer';
import { api } from './services/api';
import { CandidateProfile, SearchMission, Job, AgentLog, JobUserStatus } from './types';

export function App() {
  const [activeTab, setActiveTab] = useState<string>('control');
  const [profile, setProfile] = useState<CandidateProfile | null>(null);
  const [missions, setMissions] = useState<SearchMission[]>([]);
  const [currentMission, setCurrentMission] = useState<SearchMission | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [logs, setLogs] = useState<AgentLog[]>([]);
  const [isMissionRunning, setIsMissionRunning] = useState<boolean>(false);

  // Load initial data
  useEffect(() => {
    fetchProfile();
    fetchMissions();
    fetchJobs();
    fetchLogs();
  }, []);

  const fetchProfile = async () => {
    try {
      const data = await api.getProfile();
      setProfile(data);
    } catch (err) {
      console.error('Error fetching profile:', err);
    }
  };

  const fetchMissions = async () => {
    try {
      const data = await api.getMissions();
      setMissions(data);
      if (data.length > 0 && !currentMission) {
        setCurrentMission(data[0]);
      }
    } catch (err) {
      console.error('Error fetching missions:', err);
    }
  };

  const fetchJobs = async (missionId?: string) => {
    try {
      const data = await api.getJobs({ mission_id: missionId });
      setJobs(data);
    } catch (err) {
      console.error('Error fetching jobs:', err);
    }
  };

  const fetchLogs = async (missionId?: string) => {
    try {
      const data = await api.getAgentLogs(missionId);
      setLogs(data);
    } catch (err) {
      console.error('Error fetching logs:', err);
    }
  };

  // Start new multi-agent search mission
  const handleStartMission = async (userPrompt: string) => {
    setIsMissionRunning(true);
    try {
      const newMission = await api.createMission(userPrompt);
      setCurrentMission(newMission);
      setMissions(prev => [newMission, ...prev]);

      // Connect SSE EventSource stream for real-time live agent updates
      const eventSource = new EventSource(`/api/missions/${newMission.id}/events`);
      
      eventSource.onmessage = (event) => {
        try {
          const payload = JSON.parse(event.data);

          if (payload.event_type === 'MISSION_COMPLETED' || payload.event_type === 'COMPLETED') {
            eventSource.close();
            setIsMissionRunning(false);
            fetchJobs(newMission.id);
            fetchMissions();
            api.getMission(newMission.id).then(m => setCurrentMission(m));
          } else if (payload.event_type === 'AGENT_LOG') {
            const logItem: AgentLog = {
              id: Math.random().toString(),
              mission_id: payload.mission_id,
              agent_name: payload.data.agent_name,
              agent_role: payload.data.agent_role,
              log_level: payload.data.log_level,
              message: payload.data.message,
              details: payload.data.details,
              timestamp: payload.data.timestamp
            };
            setLogs(prev => [logItem, ...prev]);

            if (payload.data.message && payload.data.message.includes('MISSION COMPLETE!')) {
              setIsMissionRunning(false);
              fetchJobs(newMission.id);
              fetchMissions();
              api.getMission(newMission.id).then(m => setCurrentMission(m));
            }
          }
        } catch (err) {
          console.error('SSE parse error:', err);
        }
      };

      // Poll periodically until mission completes
      const interval = setInterval(async () => {
        try {
          const updated = await api.getMission(newMission.id);
          setCurrentMission(updated);

          if (updated.status === 'COMPLETED' || updated.status === 'FAILED') {
            clearInterval(interval);
            eventSource.close();
            setIsMissionRunning(false);
            fetchJobs(newMission.id);
            fetchMissions();
          }
        } catch (e) {
          console.error(e);
        }
      }, 1500);

    } catch (err) {
      console.error('Failed to start mission:', err);
      setIsMissionRunning(false);
    }
  };

  const handleUpdateProfile = async (data: Partial<CandidateProfile>) => {
    try {
      const updated = await api.updateProfile(data);
      setProfile(updated);
    } catch (err) {
      console.error('Failed to update profile:', err);
    }
  };

  const handleUploadResume = async (file: File) => {
    try {
      const res = await api.uploadResume(file);
      setProfile(res.profile);
    } catch (err) {
      console.error('Failed to upload resume:', err);
    }
  };

  const handleUpdateJobStatus = async (jobId: string, status: JobUserStatus) => {
    try {
      await api.updateJobStatus(jobId, status);
      setJobs(prev => prev.map(j => j.id === jobId ? { ...j, user_status: status } : j));
      if (selectedJob && selectedJob.id === jobId) {
        setSelectedJob({ ...selectedJob, user_status: status });
      }
    } catch (err) {
      console.error('Failed to update job status:', err);
    }
  };

  return (
    <div className="min-h-screen bg-dark-950 text-slate-100 flex flex-col">
      {/* Top Header Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isMissionRunning={isMissionRunning}
        activeJobsCount={jobs.length}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'control' && (
          <MissionControl
            currentMission={currentMission}
            logs={logs}
            isMissionRunning={isMissionRunning}
            onStartMission={handleStartMission}
            onViewJobs={() => setActiveTab('jobs')}
          />
        )}

        {activeTab === 'jobs' && (
          <JobExplorer
            jobs={jobs}
            onSelectJob={setSelectedJob}
            onUpdateStatus={handleUpdateJobStatus}
          />
        )}

        {activeTab === 'profile' && (
          <CandidateProfileView
            profile={profile}
            onUpdateProfile={handleUpdateProfile}
            onUploadResume={handleUploadResume}
          />
        )}

        {activeTab === 'history' && (
          <SearchHistory
            missions={missions}
            onSelectMission={(m) => {
              setCurrentMission(m);
              fetchJobs(m.id);
              setActiveTab('jobs');
            }}
            onReRun={(prompt) => {
              setActiveTab('control');
              handleStartMission(prompt);
            }}
          />
        )}

        {activeTab === 'logs' && (
          <AgentLogViewer logs={logs} />
        )}
      </main>

      {/* Job Detail Modal */}
      {selectedJob && (
        <JobDetailModal
          job={selectedJob}
          onClose={() => setSelectedJob(null)}
          onUpdateStatus={handleUpdateJobStatus}
        />
      )}

      {/* Footer */}
      <footer className="border-t border-dark-900 bg-dark-950 py-6 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>CAREERHIVE AI — Autonomous Multi-Agent Career Team</span>
          <span>Powered by TinyFish Search & Fetch Web Capabilities</span>
        </div>
      </footer>
    </div>
  );
}
export default App;
