import React, { useState } from 'react';
import { Terminal, Search, Filter, ShieldAlert, CheckCircle2, Info } from 'lucide-react';
import { AgentLog } from '../types';

interface AgentLogViewerProps {
  logs: AgentLog[];
}

export const AgentLogViewer: React.FC<AgentLogViewerProps> = ({ logs }) => {
  const [filterLevel, setFilterLevel] = useState<string>('ALL');
  const [searchFilter, setSearchFilter] = useState<string>('');

  const filteredLogs = logs.filter(log => {
    const matchesLevel = filterLevel === 'ALL' || log.log_level === filterLevel;
    const matchesSearch = 
      log.agent_name.toLowerCase().includes(searchFilter.toLowerCase()) ||
      log.message.toLowerCase().includes(searchFilter.toLowerCase());
    return matchesLevel && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="glass-panel rounded-2xl p-6 border border-dark-800 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Terminal className="w-6 h-6 text-hive-cyan" />
            <div>
              <h2 className="text-xl font-bold text-white">Agent Execution & Debug Console</h2>
              <p className="text-xs text-slate-400">Technical telemetry, TinyFish query traces, and multi-agent event logs</p>
            </div>
          </div>

          <span className="text-xs font-mono px-3 py-1 bg-dark-850 border border-dark-700 text-hive-cyan rounded-full">
            {filteredLogs.length} Events Recorded
          </span>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2 border-t border-dark-800 text-xs">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search by agent name or log message..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="w-full bg-dark-950 text-slate-200 px-3.5 py-2 rounded-xl border border-dark-700 focus:border-hive-cyan outline-none"
            />
          </div>

          <select
            value={filterLevel}
            onChange={(e) => setFilterLevel(e.target.value)}
            className="bg-dark-950 text-slate-200 px-3.5 py-2 rounded-xl border border-dark-700 focus:border-hive-cyan outline-none"
          >
            <option value="ALL">Log Level: All</option>
            <option value="INFO">INFO</option>
            <option value="SUCCESS">SUCCESS</option>
            <option value="WARNING">WARNING</option>
            <option value="ERROR">ERROR</option>
            <option value="DEBUG">DEBUG</option>
          </select>
        </div>
      </div>

      {/* Log Console Output */}
      <div className="glass-panel rounded-2xl p-6 border border-dark-800 bg-dark-950 font-mono text-xs space-y-2 max-h-[600px] overflow-y-auto">
        {filteredLogs.length === 0 ? (
          <div className="text-slate-500 text-center py-12">
            No technical agent logs found matching filter criteria.
          </div>
        ) : (
          filteredLogs.map((log, idx) => (
            <div key={idx} className="p-3 rounded-lg bg-dark-900/80 border border-dark-800 flex flex-col space-y-1">
              <div className="flex items-center justify-between text-[10px] text-slate-500">
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-0.5 rounded font-bold ${
                    log.log_level === 'SUCCESS' ? 'bg-hive-emerald/20 text-hive-emerald' :
                    log.log_level === 'WARNING' ? 'bg-hive-amber/20 text-hive-amber' :
                    log.log_level === 'ERROR' ? 'bg-red-500/20 text-red-400' :
                    'bg-hive-cyan/20 text-hive-cyan'
                  }`}>
                    {log.log_level}
                  </span>
                  <span className="font-bold text-slate-300">{log.agent_name}</span>
                </div>
                <span>{new Date(log.timestamp).toLocaleString()}</span>
              </div>

              <p className="text-slate-200 text-xs pl-2 border-l-2 border-dark-700">
                {log.message}
              </p>

              {log.details && Object.keys(log.details).length > 0 && (
                <pre className="text-[10px] bg-dark-950 p-2 rounded text-slate-400 overflow-x-auto">
                  {JSON.stringify(log.details, null, 2)}
                </pre>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
