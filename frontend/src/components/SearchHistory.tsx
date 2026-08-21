import React from 'react';
import { History, Calendar, CheckCircle2, RefreshCw, ArrowRight } from 'lucide-react';
import { SearchMission } from '../types';

interface SearchHistoryProps {
  missions: SearchMission[];
  onSelectMission: (mission: SearchMission) => void;
  onReRun: (prompt: string) => void;
}

export const SearchHistory: React.FC<SearchHistoryProps> = ({
  missions,
  onSelectMission,
  onReRun
}) => {
  return (
    <div className="space-y-6">
      <div className="glass-panel rounded-2xl p-6 border border-dark-800 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <History className="w-6 h-6 text-hive-cyan" />
          <div>
            <h2 className="text-xl font-bold text-white">Search Mission History</h2>
            <p className="text-xs text-slate-400">Review past multi-agent execution runs and re-run search commands</p>
          </div>
        </div>

        <span className="text-xs font-semibold px-3 py-1 bg-dark-850 border border-dark-700 text-slate-300 rounded-full">
          {missions.length} Missions Saved
        </span>
      </div>

      <div className="space-y-4">
        {missions.length === 0 ? (
          <div className="glass-panel rounded-2xl p-12 text-center text-slate-400 border border-dark-800">
            No mission history recorded yet. Dispatch your first CEO command from Mission Control.
          </div>
        ) : (
          missions.map((mission) => (
            <div
              key={mission.id}
              className="glass-panel glass-panel-hover rounded-2xl p-6 border border-dark-800 flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-2 flex-1">
                <div className="flex items-center space-x-3 text-xs">
                  <span className="flex items-center space-x-1 text-slate-400">
                    <Calendar className="w-3.5 h-3.5 text-slate-500" />
                    <span>{new Date(mission.created_at).toLocaleDateString()} {new Date(mission.created_at).toLocaleTimeString()}</span>
                  </span>

                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    mission.status === 'COMPLETED' ? 'bg-hive-emerald/10 text-hive-emerald border border-hive-emerald/30' :
                    mission.status === 'IN_PROGRESS' ? 'bg-hive-cyan/10 text-hive-cyan border border-hive-cyan/30 animate-pulse' :
                    'bg-hive-amber/10 text-hive-amber border border-hive-amber/30'
                  }`}>
                    {mission.status}
                  </span>
                </div>

                <p className="font-semibold text-sm text-white line-clamp-2">
                  "{mission.user_prompt}"
                </p>

                {mission.strategy_summary && (
                  <p className="text-xs text-slate-400 line-clamp-1">
                    {mission.strategy_summary}
                  </p>
                )}
              </div>

              <div className="flex items-center space-x-3">
                <button
                  onClick={() => onReRun(mission.user_prompt)}
                  className="bg-dark-850 hover:bg-dark-800 border border-dark-700 text-slate-200 px-4 py-2 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-hive-cyan" />
                  <span>Re-Run</span>
                </button>

                <button
                  onClick={() => onSelectMission(mission)}
                  className="bg-hive-cyan/10 hover:bg-hive-cyan/20 border border-hive-cyan/30 text-hive-cyan px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition"
                >
                  <span>View Results</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
