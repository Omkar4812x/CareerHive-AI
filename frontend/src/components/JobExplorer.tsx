import React, { useState } from 'react';
import { 
  Briefcase, 
  MapPin, 
  Building2, 
  ExternalLink, 
  CheckCircle2, 
  ShieldAlert, 
  Filter, 
  SlidersHorizontal, 
  Grid, 
  List, 
  Clock, 
  Award,
  Sparkles,
  Layers,
  ChevronRight
} from 'lucide-react';
import { Job, JobUserStatus } from '../types';

interface JobExplorerProps {
  jobs: Job[];
  onSelectJob: (job: Job) => void;
  onUpdateStatus: (jobId: string, status: JobUserStatus) => void;
}

export const JobExplorer: React.FC<JobExplorerProps> = ({
  jobs,
  onSelectJob,
  onUpdateStatus
}) => {
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [minScore, setMinScore] = useState<number>(0);
  const [selectedLoc, setSelectedLoc] = useState<string>('ALL');
  const [selectedPlatform, setSelectedPlatform] = useState<string>('ALL');
  const [selectedUserStatus, setSelectedUserStatus] = useState<string>('ALL');

  // Filter jobs
  const filteredJobs = jobs.filter(job => {
    const matchesSearch = 
      job.job_title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.skills_required.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));

    const score = job.match?.match_score || 0;
    const matchesScore = score >= minScore;

    const matchesLoc = selectedLoc === 'ALL' || job.location.toLowerCase().includes(selectedLoc.toLowerCase());
    const matchesPlatform = selectedPlatform === 'ALL' || job.source_platform.toLowerCase().includes(selectedPlatform.toLowerCase());
    const matchesUserStatus = selectedUserStatus === 'ALL' || job.user_status === selectedUserStatus;

    return matchesSearch && matchesScore && matchesLoc && matchesPlatform && matchesUserStatus;
  });

  const getScoreBadgeColor = (score: number) => {
    if (score >= 88) return 'bg-hive-emerald/20 text-hive-emerald border-hive-emerald/40';
    if (score >= 75) return 'bg-hive-cyan/20 text-hive-cyan border-hive-cyan/40';
    return 'bg-hive-amber/20 text-hive-amber border-hive-amber/40';
  };

  return (
    <div className="space-y-6">
      
      {/* Header & Search Controls */}
      <div className="glass-panel rounded-2xl p-6 border border-dark-800 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center space-x-2">
              <Briefcase className="w-5 h-5 text-hive-cyan" />
              <span>Verified Job Opportunities</span>
              <span className="text-xs bg-hive-cyan/10 border border-hive-cyan/30 text-hive-cyan px-2.5 py-0.5 rounded-full font-semibold">
                {filteredJobs.length} Matched
              </span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">Ranked by resume compatibility & verified live postings</p>
          </div>

          {/* Grid vs Table View Toggle */}
          <div className="flex items-center space-x-1 bg-dark-950 p-1 rounded-xl border border-dark-700">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg text-xs flex items-center space-x-1 transition ${viewMode === 'grid' ? 'bg-hive-cyan text-dark-950 font-bold' : 'text-slate-400 hover:text-white'}`}
            >
              <Grid className="w-4 h-4" />
              <span className="hidden sm:inline">Grid</span>
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-2 rounded-lg text-xs flex items-center space-x-1 transition ${viewMode === 'table' ? 'bg-hive-cyan text-dark-950 font-bold' : 'text-slate-400 hover:text-white'}`}
            >
              <List className="w-4 h-4" />
              <span className="hidden sm:inline">Table</span>
            </button>
          </div>
        </div>

        {/* Filter Controls Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-2 border-t border-dark-800 text-xs">
          
          {/* Keyword Search */}
          <div className="lg:col-span-2">
            <input
              type="text"
              placeholder="Filter by role, company or skill (e.g. Java, SQL)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-dark-950 text-slate-200 px-3.5 py-2 rounded-xl border border-dark-700 focus:border-hive-cyan outline-none"
            />
          </div>

          {/* Min Score Filter */}
          <div>
            <select
              value={minScore}
              onChange={(e) => setMinScore(Number(e.target.value))}
              className="w-full bg-dark-950 text-slate-200 px-3 py-2 rounded-xl border border-dark-700 focus:border-hive-cyan outline-none"
            >
              <option value={0}>Min Match Score: Any</option>
              <option value={80}>Min Match: 80%+</option>
              <option value={85}>Min Match: 85%+</option>
              <option value={90}>Min Match: 90%+</option>
            </select>
          </div>

          {/* Location Filter */}
          <div>
            <select
              value={selectedLoc}
              onChange={(e) => setSelectedLoc(e.target.value)}
              className="w-full bg-dark-950 text-slate-200 px-3 py-2 rounded-xl border border-dark-700 focus:border-hive-cyan outline-none"
            >
              <option value="ALL">Location: All</option>
              <option value="Pune">Pune</option>
              <option value="Hyderabad">Hyderabad</option>
              <option value="Bangalore">Bangalore</option>
              <option value="Remote">Remote</option>
            </select>
          </div>

          {/* Status Pipeline Filter */}
          <div>
            <select
              value={selectedUserStatus}
              onChange={(e) => setSelectedUserStatus(e.target.value)}
              className="w-full bg-dark-950 text-slate-200 px-3 py-2 rounded-xl border border-dark-700 focus:border-hive-cyan outline-none"
            >
              <option value="ALL">Pipeline: All</option>
              <option value="SAVED">Saved</option>
              <option value="INTERESTED">Interested</option>
              <option value="APPLIED">Applied</option>
              <option value="INTERVIEW">Interviewing</option>
              <option value="OFFER">Offer Received</option>
              <option value="REJECTED">Rejected</option>
            </select>
          </div>

        </div>
      </div>

      {/* Grid View */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredJobs.map((job) => {
            const score = job.match?.match_score || 0;
            return (
              <div
                key={job.id}
                className="glass-panel glass-panel-hover rounded-2xl p-6 border border-dark-800 flex flex-col justify-between relative group cursor-pointer"
                onClick={() => onSelectJob(job)}
              >
                <div>
                  {/* Top Badges */}
                  <div className="flex items-center justify-between mb-3">
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-black border ${getScoreBadgeColor(score)} flex items-center space-x-1`}>
                      <Sparkles className="w-3 h-3" />
                      <span>{score}% MATCH</span>
                    </span>

                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${
                      job.verification_status === 'VERIFIED'
                        ? 'bg-hive-emerald/10 text-hive-emerald border-hive-emerald/30'
                        : 'bg-hive-amber/10 text-hive-amber border-hive-amber/30'
                    }`}>
                      {job.verification_status}
                    </span>
                  </div>

                  {/* Job Title & Company */}
                  <h3 className="font-extrabold text-base text-white group-hover:text-hive-cyan transition line-clamp-1">
                    {job.job_title}
                  </h3>
                  <div className="flex items-center space-x-2 text-xs text-slate-400 mt-1">
                    <Building2 className="w-3.5 h-3.5 text-slate-500" />
                    <span className="font-medium text-slate-300">{job.company_name}</span>
                  </div>

                  <div className="flex items-center space-x-3 text-xs text-slate-400 mt-2">
                    <span className="flex items-center space-x-1">
                      <MapPin className="w-3 h-3 text-slate-500" />
                      <span>{job.location}</span>
                    </span>
                    <span>•</span>
                    <span className="text-slate-300">{job.experience_required}</span>
                  </div>

                  {/* Skills Tags */}
                  <div className="flex flex-wrap gap-1.5 mt-4">
                    {job.skills_required.slice(0, 4).map((skill, idx) => {
                      const isMatched = job.match?.matched_skills.includes(skill);
                      return (
                        <span
                          key={idx}
                          className={`text-[11px] px-2 py-0.5 rounded font-medium ${
                            isMatched
                              ? 'bg-hive-cyan/10 text-hive-cyan border border-hive-cyan/20'
                              : 'bg-dark-850 text-slate-400 border border-dark-700'
                          }`}
                        >
                          {skill}
                        </span>
                      );
                    })}
                    {job.skills_required.length > 4 && (
                      <span className="text-[10px] text-slate-500 self-center">+{job.skills_required.length - 4} more</span>
                    )}
                  </div>
                </div>

                {/* Footer Controls */}
                <div className="pt-4 mt-4 border-t border-dark-800 flex items-center justify-between" onClick={(e) => e.stopPropagation()}>
                  <select
                    value={job.user_status}
                    onChange={(e) => onUpdateStatus(job.id, e.target.value as JobUserStatus)}
                    className="bg-dark-950 text-xs font-medium text-slate-300 px-2.5 py-1.5 rounded-lg border border-dark-700 focus:border-hive-cyan outline-none"
                  >
                    <option value="SAVED">Saved</option>
                    <option value="INTERESTED">Interested</option>
                    <option value="APPLIED">Applied</option>
                    <option value="INTERVIEW">Interview</option>
                    <option value="OFFER">Offer</option>
                    <option value="REJECTED">Rejected</option>
                  </select>

                  <a
                    href={job.canonical_url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-hive-cyan hover:underline flex items-center space-x-1 font-semibold"
                  >
                    <span>Apply URL</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Table View */}
      {viewMode === 'table' && (
        <div className="glass-panel rounded-2xl overflow-hidden border border-dark-800">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-dark-950 text-slate-400 uppercase font-semibold border-b border-dark-800">
                <tr>
                  <th className="px-4 py-3">Match Score</th>
                  <th className="px-4 py-3">Job Title & Company</th>
                  <th className="px-4 py-3">Location</th>
                  <th className="px-4 py-3">Source Platform</th>
                  <th className="px-4 py-3">Status Pipeline</th>
                  <th className="px-4 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-800">
                {filteredJobs.map((job) => {
                  const score = job.match?.match_score || 0;
                  return (
                    <tr
                      key={job.id}
                      className="hover:bg-dark-800/60 transition cursor-pointer"
                      onClick={() => onSelectJob(job)}
                    >
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded text-xs font-extrabold border ${getScoreBadgeColor(score)}`}>
                          {score}%
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-bold text-white text-sm">{job.job_title}</div>
                        <div className="text-slate-400">{job.company_name}</div>
                      </td>
                      <td className="px-4 py-3">{job.location}</td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-0.5 bg-dark-850 rounded text-slate-300 border border-dark-700 font-mono text-[11px]">
                          {job.source_platform}
                        </span>
                      </td>
                      <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                        <select
                          value={job.user_status}
                          onChange={(e) => onUpdateStatus(job.id, e.target.value as JobUserStatus)}
                          className="bg-dark-950 text-xs text-slate-300 px-2 py-1 rounded border border-dark-700 outline-none"
                        >
                          <option value="SAVED">Saved</option>
                          <option value="INTERESTED">Interested</option>
                          <option value="APPLIED">Applied</option>
                          <option value="INTERVIEW">Interview</option>
                          <option value="OFFER">Offer</option>
                          <option value="REJECTED">Rejected</option>
                        </select>
                      </td>
                      <td className="px-4 py-3 text-right" onClick={(e) => e.stopPropagation()}>
                        <a
                          href={job.canonical_url}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center space-x-1 text-hive-cyan hover:underline font-semibold"
                        >
                          <span>Apply</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};
