import React from 'react';
import { 
  X, 
  ExternalLink, 
  Building2, 
  MapPin, 
  Clock, 
  Award, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles,
  DollarSign,
  FileText,
  ShieldCheck
} from 'lucide-react';
import { Job, JobUserStatus } from '../types';

interface JobDetailModalProps {
  job: Job | null;
  onClose: () => void;
  onUpdateStatus: (jobId: string, status: JobUserStatus) => void;
}

export const JobDetailModal: React.FC<JobDetailModalProps> = ({
  job,
  onClose,
  onUpdateStatus
}) => {
  if (!job) return null;

  const match = job.match;
  const score = match?.match_score || 0;
  const breakdown = match?.score_breakdown;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="glass-panel bg-dark-900 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-dark-700 shadow-2xl relative">
        
        {/* Header */}
        <div className="sticky top-0 bg-dark-900/95 backdrop-blur border-b border-dark-800 p-6 flex items-start justify-between z-10">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <span className="bg-hive-cyan/20 border border-hive-cyan/40 text-hive-cyan text-xs font-black px-3 py-1 rounded-full flex items-center space-x-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{score}% RESUME MATCH SCORE</span>
              </span>

              <span className="bg-dark-850 text-slate-300 text-xs px-2.5 py-1 rounded border border-dark-700 font-mono">
                {job.source_platform}
              </span>
            </div>

            <h2 className="text-2xl font-black text-white">{job.job_title}</h2>
            <div className="flex items-center space-x-3 text-sm text-slate-400 mt-1">
              <span className="font-semibold text-slate-200 flex items-center space-x-1">
                <Building2 className="w-4 h-4 text-slate-500" />
                <span>{job.company_name}</span>
              </span>
              <span>•</span>
              <span className="flex items-center space-x-1">
                <MapPin className="w-4 h-4 text-slate-500" />
                <span>{job.location}</span>
              </span>
              <span>•</span>
              <span>{job.experience_required}</span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-dark-850 text-slate-400 hover:text-white hover:bg-dark-800 border border-dark-700 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6">
          
          {/* Match Rationale & Breakdown */}
          {match && (
            <div className="glass-panel rounded-xl p-5 border border-hive-cyan/20 bg-hive-cyan/5 space-y-4">
              <h3 className="font-bold text-sm text-white flex items-center space-x-2">
                <Award className="w-4 h-4 text-hive-cyan" />
                <span>Match Score Breakdown & Explanation</span>
              </h3>

              {match.explanation && (
                <p className="text-xs text-slate-300 leading-relaxed font-medium bg-dark-950/60 p-3 rounded-lg border border-dark-800">
                  {match.explanation}
                </p>
              )}

              {/* Score Bar Indicators */}
              {breakdown && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-xs">
                  <div className="bg-dark-950 p-2.5 rounded-lg border border-dark-800">
                    <span className="text-slate-400 block text-[10px]">Skills Match</span>
                    <span className="font-bold text-hive-cyan">{breakdown.skills_score} / 30 pts</span>
                  </div>
                  <div className="bg-dark-950 p-2.5 rounded-lg border border-dark-800">
                    <span className="text-slate-400 block text-[10px]">Role Alignment</span>
                    <span className="font-bold text-hive-cyan">{breakdown.role_score} / 25 pts</span>
                  </div>
                  <div className="bg-dark-950 p-2.5 rounded-lg border border-dark-800">
                    <span className="text-slate-400 block text-[10px]">Experience</span>
                    <span className="font-bold text-hive-cyan">{breakdown.experience_score} / 15 pts</span>
                  </div>
                  <div className="bg-dark-950 p-2.5 rounded-lg border border-dark-800">
                    <span className="text-slate-400 block text-[10px]">Location</span>
                    <span className="font-bold text-hive-cyan">{breakdown.location_score} / 10 pts</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Matched vs Missing Skills Matrix */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Matched Skills */}
            <div className="bg-dark-950 rounded-xl p-4 border border-dark-800 space-y-2">
              <h4 className="font-bold text-xs text-hive-emerald flex items-center space-x-1.5 uppercase tracking-wider">
                <CheckCircle2 className="w-4 h-4" />
                <span>Matched Skills ({match?.matched_skills.length || 0})</span>
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {match?.matched_skills.map((s, idx) => (
                  <span key={idx} className="px-2.5 py-1 bg-hive-emerald/10 text-hive-emerald border border-hive-emerald/30 text-xs font-semibold rounded-lg">
                    ✓ {s}
                  </span>
                ))}
              </div>
            </div>

            {/* Missing Skills */}
            <div className="bg-dark-950 rounded-xl p-4 border border-dark-800 space-y-2">
              <h4 className="font-bold text-xs text-hive-amber flex items-center space-x-1.5 uppercase tracking-wider">
                <AlertCircle className="w-4 h-4" />
                <span>Missing Skills ({match?.missing_skills.length || 0})</span>
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {match?.missing_skills.length === 0 ? (
                  <span className="text-xs text-slate-500">None! Complete skill match.</span>
                ) : (
                  match?.missing_skills.map((s, idx) => (
                    <span key={idx} className="px-2.5 py-1 bg-hive-amber/10 text-hive-amber border border-hive-amber/30 text-xs font-medium rounded-lg">
                      ⚠ {s}
                    </span>
                  ))
                )}
              </div>
            </div>

          </div>

          {/* Company Brief */}
          {match?.research_brief && (
            <div className="bg-dark-950 rounded-xl p-4 border border-dark-800 space-y-2">
              <h4 className="font-bold text-xs text-slate-300 uppercase tracking-wider">Company Opportunity Brief</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                {match.research_brief}
              </p>
            </div>
          )}

          {/* Job Description Text */}
          <div className="space-y-2">
            <h4 className="font-bold text-sm text-white">Full Job Description</h4>
            <div className="bg-dark-950 rounded-xl p-4 border border-dark-800 text-xs text-slate-300 leading-relaxed whitespace-pre-wrap">
              {job.description || 'No detailed description text provided.'}
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="sticky bottom-0 bg-dark-900/95 backdrop-blur border-t border-dark-800 p-6 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-xs text-slate-400">Update Pipeline Status:</span>
            <select
              value={job.user_status}
              onChange={(e) => onUpdateStatus(job.id, e.target.value as JobUserStatus)}
              className="bg-dark-850 text-xs text-slate-200 px-3 py-1.5 rounded-lg border border-dark-700 outline-none"
            >
              <option value="SAVED">Saved</option>
              <option value="INTERESTED">Interested</option>
              <option value="APPLIED">Applied</option>
              <option value="INTERVIEW">Interviewing</option>
              <option value="OFFER">Offer Received</option>
              <option value="REJECTED">Rejected</option>
            </select>
          </div>

          <a
            href={job.canonical_url}
            target="_blank"
            rel="noreferrer"
            className="bg-gradient-to-r from-hive-cyan to-hive-indigo hover:from-hive-cyan/90 hover:to-hive-indigo/90 text-dark-950 font-bold px-6 py-2.5 rounded-xl text-sm flex items-center space-x-2 shadow-lg shadow-hive-cyan/20 transition"
          >
            <span>Apply Directly</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>

      </div>
    </div>
  );
};
