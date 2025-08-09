

import React from 'react';
import { ActiveGateInfo, GateType } from '../types';
import { GATES } from '../constants';
import { GateIcon, TrashIcon } from './icons';

interface GatePanelProps {
  availableGates: GateType[];
  activeGate: ActiveGateInfo | null;
  onSelectGate: (gateId: GateType | null) => void;
}

export const GatePanel: React.FC<GatePanelProps> = ({ availableGates, activeGate, onSelectGate }) => {
  const tools = GATES.filter(g => availableGates.includes(g.id));

  const isDeleteActive = activeGate && activeGate.type === 'DEL';

  return (
    <div className="bg-gray-900/50 h-full p-4 flex flex-col">
      <h2 className="text-2xl font-orbitron text-cyan-400 border-b-2 border-cyan-500/30 pb-2 mb-4 text-glow">Gate Arsenal</h2>
      <div className="space-y-2 flex-grow">
        {tools.map(gate => (
          <button
            key={gate.id}
            onClick={() => onSelectGate(activeGate && activeGate.type === gate.id ? null : gate.id)}
            className={`w-full flex items-center space-x-3 p-3 rounded-md text-left transition-all duration-200 ${
              activeGate && activeGate.type === gate.id
                ? 'bg-cyan-500/80 text-black shadow-lg neon-box'
                : 'bg-gray-800/70 hover:bg-gray-700/90 text-cyan-300'
            }`}
          >
            <div className={`p-1 rounded ${activeGate && activeGate.type === gate.id ? 'text-black' : 'text-cyan-400'}`}>
                <GateIcon type={gate.id}/>
            </div>
            <div>
                <p className={`font-bold ${activeGate && activeGate.type === gate.id ? 'text-black' : 'text-cyan-200'}`}>{gate.name}</p>
                <p className={`text-xs ${activeGate && activeGate.type === gate.id ? 'text-gray-900' : 'text-gray-400'}`}>{gate.description}</p>
            </div>
          </button>
        ))}
      </div>
      <div className="flex-shrink-0 pt-4 border-t-2 border-cyan-500/30">
         <button
            onClick={() => onSelectGate(isDeleteActive ? null : 'DEL')}
            className={`w-full flex items-center space-x-3 p-3 rounded-md text-left transition-all duration-200 ${
              isDeleteActive
                ? 'bg-red-500/80 text-white shadow-lg neon-box'
                : 'bg-gray-800/70 hover:bg-gray-700/90 text-red-400'
            }`}
          >
            <div className={`p-1 rounded`}>
                <TrashIcon />
            </div>
            <div>
                <p className={`font-bold`}>Delete Gate</p>
                <p className={`text-xs ${isDeleteActive ? 'text-gray-200' : 'text-gray-400'}`}>Remove a gate from the circuit</p>
            </div>
          </button>
      </div>
    </div>
  );
};