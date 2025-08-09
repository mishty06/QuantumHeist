
import React from 'react';
import { Role, Tool, ToolId } from '../types';
import { TOOLS } from '../constants';

interface ToolPanelProps {
  role: Role;
  activeTool: ToolId;
  onSelectTool: (toolId: ToolId) => void;
  isLoading: boolean;
}

export const ToolPanel: React.FC<ToolPanelProps> = ({ role, activeTool, onSelectTool, isLoading }) => {
  const availableTools = TOOLS.filter(t => t.roles.includes(role));

  return (
    <div className="bg-gray-900/50 border-r-2 border-cyan-500/30 h-full p-4 flex flex-col">
      <h2 className="text-2xl font-orbitron text-cyan-400 border-b-2 border-cyan-500/30 pb-2 mb-4 text-glow">Tool Arsenal</h2>
      <div className="space-y-2">
        {availableTools.map(tool => (
          <button
            key={tool.id}
            disabled={isLoading}
            onClick={() => onSelectTool(tool.id)}
            className={`w-full flex items-center space-x-3 p-3 rounded-md text-left transition-all duration-200 ${
              activeTool === tool.id
                ? 'bg-cyan-500/80 text-black shadow-lg neon-box'
                : 'bg-gray-800/70 hover:bg-gray-700/90 text-cyan-300'
            } ${isLoading ? 'cursor-not-allowed opacity-50' : ''}`}
          >
            <div className={`p-1 rounded ${activeTool === tool.id ? '' : 'text-cyan-400'}`}>{tool.icon}</div>
            <div>
                <p className={`font-bold ${activeTool === tool.id ? 'text-black' : 'text-cyan-200'}`}>{tool.name}</p>
                <p className={`text-xs ${activeTool === tool.id ? 'text-gray-900' : 'text-gray-400'}`}>{tool.description}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
