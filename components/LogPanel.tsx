import React, { useEffect, useRef } from 'react';
import { LogEntry } from '../types';

interface LogPanelProps {
  logs: LogEntry[];
}

const typeClasses: Record<LogEntry['type'], string> = {
  info: 'text-gray-300',
  success: 'text-green-400',
  error: 'text-red-500',
  system: 'text-cyan-400',
  player: 'text-yellow-300',
  gemini: 'text-purple-400',
};

export const LogPanel: React.FC<LogPanelProps> = ({ logs }) => {
    const logContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (logContainerRef.current) {
            logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
        }
    }, [logs]);

  return (
    <div className="bg-gray-900/50 border-l-2 border-cyan-500/30 h-full p-4 flex flex-col">
      <h2 className="text-2xl font-orbitron text-cyan-400 border-b-2 border-cyan-500/30 pb-2 mb-4 text-glow">Activity Log</h2>
      <div ref={logContainerRef} className="flex-grow overflow-y-auto pr-2 space-y-2">
        {logs.map((log) => (
          <div key={log.id} className="flex text-sm">
            <span className="text-gray-500 mr-2">{log.timestamp} &gt;</span>
            <p className={`${typeClasses[log.type]} whitespace-pre-wrap`}>{log.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
};