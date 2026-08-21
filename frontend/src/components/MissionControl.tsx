import React, { useState } from 'react';
import { 
  Send, 
  Bot, 
  Sparkles, 
  Search, 
  Building2, 
  CheckCircle2, 
  Layers, 
  Zap, 
  FileText, 
  AlertCircle,
  RefreshCw,
  ArrowRight,
  ShieldCheck,
  Briefcase,
  Terminal
} from 'lucide-react';
import { SearchMission, AgentLog } from '../types';

interface MissionControlProps {
  currentMission: SearchMission | null;
  logs: AgentLog[];
  isMissionRunning: boolean;
  onStartMission: (prompt: string) => void;
  onViewJobs: () => void;
}

export const MissionControl: React.FC<MissionControlProps> = ({
  currentMission,
  logs,
  isMissionRunning,
  onStartMission,
  onViewJobs
}) => {
  const [promptInput, setPromptInput] = useState(
    "Find active Java Developer, Junior Java Developer, Backend Developer, SQL Developer, Software Developer and Web Developer jobs posted within the last 48 hours in Pune, Hyderabad and Bangalore."
  );

  const samplePrompts = [
    "Find active Java Developer & Spring Boot jobs posted within last 48h in Pune, Hyderabad and Bangalore.",
    "Find Junior Backend Developer & SQL Developer entry-level jobs in Pune for freshers.",
    "Search startup & official company career pages for Software Developer roles in Bangalore."
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promptInput.trim() || isMissionRunning) return;
    onStartMission(promptInput);
  };

  // Agent hierarchy nodes list
  const agents = [
    { id: 'ceo', name: 'CEO Career Agent', role: 'Orchestrator', type: 'ceo', active: isMissionRunning },
    { id: 'strategist', name: 'Job Search Strategist', role: 'Query Generator', type: 'planner', active: isMissionRunning },
    { id: 'resume', name: 'Resume Intelligence', role: 'Skills Parser', type: 'planner', active: isMissionRunning },
    
    { id: 'linkedin', name: 'LinkedIn Scout', role: 'LinkedIn Worker', type: 'worker', active: isMissionRunning },
    { id: 'indeed', name: 'Indeed Scout', role: 'Indeed Worker', type: 'worker', active: isMissionRunning },
    { id: 'internshala', name: 'Internshala Scout', role: 'Fresher Worker', type: 'worker', active: isMissionRunning },
    { id: 'startup', name: 'Startup Scout', role: 'Wellfound/Cuvette', type: 'worker', active: isMissionRunning },
    { id: 'hunter', name: 'Company Career Hunter', role: 'Official Portals', type: 'worker', active: isMissionRunning },
    
    { id: 'extract', name: 'Extraction Agent', role: 'Schema Parser', type: 'pipeline', active: isMissionRunning },
    { id: 'verify', name: 'Verification Agent', role: 'URL Status Verifier', type: 'pipeline', active: isMissionRunning },
    { id: 'dedup', name: 'Deduplication Agent', role: 'Cross-Platform Merge', type: 'pipeline', active: isMissionRunning },
    { id: 'match', name: 'Job Matching Agent', role: '0-100 Score Engine', type: 'pipeline', active: isMissionRunning }
  ];

  return (
    <div className="space-y-6">
      
      {/* Command Launcher Bar */}
      <div className="glass-panel rounded-2xl p-6 relative overflow-hidden border border-hive-cyan/20">
        <div className="absolute top-0 right-0 w-96 h-96 bg-hive-cyan/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-8 h-8 rounded-lg bg-hive-cyan/10 border border-hive-cyan/30 flex items-center justify-center">
            <Zap className="w-4 h-4 text-hive-cyan" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">CEO Command Center</h2>
            <p className="text-xs text-slate-400">Instruct your CEO AI to dispatch specialized search agents across the web</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="relative">
            <textarea
              rows={3}
              value={promptInput}
              onChange={(e) => setPromptInput(e.target.value)}
              placeholder="e.g. Find active Java Developer, Junior Java Developer, and Backend Developer jobs in Pune..."
              disabled={isMissionRunning}
              className="w-full bg-dark-950/80 text-slate-100 rounded-xl px-4 py-3 border border-dark-700 focus:border-hive-cyan focus:ring-1 focus:ring-hive-cyan outline-none text-sm resize-none disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={isMissionRunning || !promptInput.trim()}
              className="absolute bottom-3 right-3 bg-gradient-to-r from-hive-cyan to-hive-indigo hover:from-hive-cyan/90 hover:to-hive-indigo/90 text-dark-950 font-bold px-5 py-2 rounded-lg text-sm flex items-center space-x-2 transition-all disabled:opacity-50 shadow-lg shadow-hive-cyan/20"
            >
              {isMissionRunning ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-dark-950" />
                  <span>Agents Working...</span>
                </>
              ) : (
                <>
                  <span>Dispatch Mission</span>
                  <Send className="w-4 h-4" />
                </>
              )}
            </button>
          </div>

          {/* Preset Commands */}
          <div className="flex items-center space-x-2 overflow-x-auto pb-1 text-xs">
            <span className="text-slate-400 font-medium whitespace-nowrap">Suggested Commands:</span>
            {samplePrompts.map((sample, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setPromptInput(sample)}
                disabled={isMissionRunning}
                className="bg-dark-850 hover:bg-dark-800 border border-dark-700 text-slate-300 px-3 py-1 rounded-full whitespace-nowrap transition"
              >
                {sample.substring(0, 45)}...
              </button>
            ))}
          </div>
        </form>
      </div>

      {/* Real-time Agent Mission Control Diagram */}
      <div className="glass-panel rounded-2xl p-6 border border-dark-800">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <Bot className="w-5 h-5 text-hive-cyan" />
            <h3 className="text-base font-bold text-white">Live Multi-Agent Hierarchy & Operations</h3>
          </div>
          {currentMission && (
            <div className="flex items-center space-x-2 bg-dark-850 border border-dark-700 px-3 py-1 rounded-full text-xs text-slate-300">
              <span>Status:</span>
              <span className="font-bold text-hive-cyan">{currentMission.status}</span>
            </div>
          )}
        </div>

        {/* Visual Multi-Agent Graph */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          
          {/* Column 1: CEO & Strategist */}
          <div className="space-y-3">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">1. Command & Strategy</div>
            <div className={`p-4 rounded-xl border transition-all ${isMissionRunning ? 'bg-hive-cyan/10 border-hive-cyan/40 shadow-md shadow-hive-cyan/10' : 'bg-dark-850 border-dark-700'}`}>
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-sm text-white">CEO Career Agent</span>
                <span className="w-2 h-2 rounded-full bg-hive-cyan animate-pulse" />
              </div>
              <p className="text-xs text-slate-400">Chief Orchestrator & Manager</p>
            </div>

            <div className="p-3 rounded-xl bg-dark-850 border border-dark-700">
              <span className="font-semibold text-xs text-slate-200 block">Job Search Strategist</span>
              <p className="text-[11px] text-slate-400">Query & Role Expansion</p>
            </div>

            <div className="p-3 rounded-xl bg-dark-850 border border-dark-700">
              <span className="font-semibold text-xs text-slate-200 block">Resume Intelligence Agent</span>
              <p className="text-[11px] text-slate-400">Skills Matrix Context</p>
            </div>
          </div>

          {/* Column 2: Platform Scouts */}
          <div className="space-y-3 md:col-span-2">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">2. Concurrent Web Scouts</div>
            <div className="grid grid-cols-2 gap-2">
              {[
                { name: 'LinkedIn Scout', desc: 'Public Postings', color: 'text-sky-400' },
                { name: 'Indeed Scout', desc: 'Active Roles', color: 'text-blue-400' },
                { name: 'Internshala Scout', desc: 'Fresher / Entry', color: 'text-amber-400' },
                { name: 'Startup Scout', desc: 'Wellfound/Cuvette', color: 'text-purple-400' },
                { name: 'India Job Portals', desc: 'Shine / Foundit / Apna', color: 'text-emerald-400' },
                { name: 'Company Career Hunter', desc: 'Official Portals', color: 'text-hive-cyan' }
              ].map((scout, idx) => (
                <div key={idx} className={`p-3 rounded-xl border transition ${isMissionRunning ? 'bg-dark-800 border-hive-cyan/30' : 'bg-dark-850 border-dark-700'}`}>
                  <div className="flex items-center justify-between">
                    <span className={`font-semibold text-xs ${scout.color}`}>{scout.name}</span>
                    {isMissionRunning && <RefreshCw className="w-3 h-3 animate-spin text-hive-cyan" />}
                  </div>
                  <p className="text-[10px] text-slate-400 mt-0.5">{scout.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Column 3: Processing Pipeline */}
          <div className="space-y-3">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">3. Verification & Match</div>
            {[
              { name: 'Job Extraction Agent', desc: 'Structured Schema' },
              { name: 'Job Verification Agent', desc: 'URL Status Check' },
              { name: 'Deduplication Agent', desc: 'Cross-Platform Merge' },
              { name: 'Job Matching Agent', desc: '0-100 Resume Compatibility' }
            ].map((pipe, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-dark-850 border border-dark-700">
                <span className="font-semibold text-xs text-slate-200 block">{pipe.name}</span>
                <p className="text-[10px] text-slate-400">{pipe.desc}</p>
              </div>
            ))}
          </div>

        </div>
      </div>

      {/* Results Callout when Completed */}
      {currentMission && currentMission.status === 'COMPLETED' && (
        <div className="glass-panel rounded-2xl p-6 border border-hive-emerald/40 bg-hive-emerald/5 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-xl bg-hive-emerald/20 border border-hive-emerald/40 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-hive-emerald" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Mission Search Completed Successfully!</h3>
              <p className="text-sm text-slate-300">
                The CEO Career Agent has verified, deduplicated, and ranked the best matching opportunities for your resume.
              </p>
            </div>
          </div>

          <button
            onClick={onViewJobs}
            className="bg-hive-emerald hover:bg-hive-emerald/90 text-dark-950 font-bold px-5 py-2.5 rounded-xl text-sm flex items-center space-x-2 transition shadow-lg shadow-hive-emerald/20"
          >
            <span>Explore Jobs</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Live SSE Stream Console */}
      <div className="glass-panel rounded-2xl p-6 border border-dark-800">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Terminal className="w-4 h-4 text-hive-cyan" />
            <h3 className="text-sm font-bold text-white">Live Agent Activity Log Stream</h3>
          </div>
          <span className="text-xs text-slate-400">{logs.length} live events recorded</span>
        </div>

        <div className="bg-dark-950 rounded-xl p-4 border border-dark-800 h-64 overflow-y-auto font-mono text-xs space-y-2">
          {logs.length === 0 ? (
            <div className="text-slate-500 text-center py-8">
              No live mission logs active. Dispatch a command to watch agents work in real time.
            </div>
          ) : (
            logs.map((log, idx) => (
              <div key={idx} className="flex items-start space-x-2">
                <span className="text-slate-500 text-[10px] whitespace-nowrap">
                  {new Date(log.timestamp).toLocaleTimeString()}
                </span>
                <span className={`font-bold px-1.5 py-0.5 rounded text-[10px] ${
                  log.log_level === 'SUCCESS' ? 'bg-hive-emerald/10 text-hive-emerald border border-hive-emerald/30' :
                  log.log_level === 'WARNING' ? 'bg-hive-amber/10 text-hive-amber border border-hive-amber/30' :
                  'bg-hive-cyan/10 text-hive-cyan border border-hive-cyan/30'
                }`}>
                  {log.agent_name}
                </span>
                <span className="text-slate-300">{log.message}</span>
              </div>
            ))
          )}
        </div>
      </div>

    </div>
  );
};
