import React from 'react';
import { 
  Bot, 
  UserCheck, 
  Briefcase, 
  History, 
  Terminal, 
  Sparkles,
  Layers
} from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isMissionRunning: boolean;
  activeJobsCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  isMissionRunning,
  activeJobsCount
}) => {
  const tabs = [
    { id: 'control', label: 'Mission Control', icon: Bot, badge: isMissionRunning ? 'LIVE' : null },
    { id: 'jobs', label: 'Job Opportunities', icon: Briefcase, count: activeJobsCount },
    { id: 'profile', label: 'Candidate Profile', icon: UserCheck },
    { id: 'history', label: 'Search History', icon: History },
    { id: 'logs', label: 'Agent Activity Logs', icon: Terminal }
  ];

  return (
    <header className="sticky top-0 z-50 bg-dark-900/90 backdrop-blur-md border-b border-dark-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('control')}>
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-hive-amber via-hive-cyan to-hive-indigo p-[2px] shadow-lg shadow-hive-cyan/20">
                <div className="w-full h-full bg-dark-950 rounded-[10px] flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-hive-cyan animate-pulse" />
                </div>
              </div>
              {isMissionRunning && (
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-hive-cyan opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-hive-cyan"></span>
                </span>
              )}
            </div>

            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-xl tracking-tight text-white">
                  CAREER<span className="text-hive-cyan">HIVE</span> <span className="text-xs px-2 py-0.5 rounded bg-hive-cyan/10 border border-hive-cyan/30 text-hive-cyan">AI AGENTS</span>
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">Autonomous Multi-Agent Career Team</p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="hidden md:flex items-center space-x-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
                    isActive
                      ? 'bg-hive-cyan/10 text-hive-cyan border border-hive-cyan/30 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-dark-800/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-hive-cyan' : 'text-slate-400'}`} />
                  <span>{tab.label}</span>
                  {tab.badge && (
                    <span className="px-1.5 py-0.5 text-[10px] font-extrabold bg-hive-cyan text-dark-950 rounded animate-pulse">
                      {tab.badge}
                    </span>
                  )}
                  {tab.count !== undefined && tab.count > 0 && (
                    <span className="px-1.5 py-0.5 text-xs font-semibold bg-dark-800 text-slate-300 rounded-full border border-dark-700">
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Active Agent Status Badge */}
          <div className="flex items-center space-x-3">
            <div className="hidden lg:flex items-center space-x-2 px-3 py-1.5 rounded-full bg-dark-850 border border-dark-700 text-xs">
              <div className={`w-2 h-2 rounded-full ${isMissionRunning ? 'bg-hive-cyan animate-ping' : 'bg-hive-emerald'}`} />
              <span className="text-slate-300 font-medium">
                CEO Status: <span className={isMissionRunning ? 'text-hive-cyan font-semibold' : 'text-hive-emerald font-semibold'}>
                  {isMissionRunning ? 'Coordinating Scouts...' : 'Ready for Command'}
                </span>
              </span>
            </div>
          </div>

        </div>
      </div>
    </header>
  );
};
