

import React from 'react';
import { Role } from '../types';

interface RoleSelectionProps {
  onSelectRole: (role: Role) => void;
}

const RoleCard: React.FC<{ role: Role, title: string, description: string, onSelect: () => void, disabled?: boolean }> = ({ role, title, description, onSelect, disabled }) => (
    <div 
        className={`bg-gray-900/50 border-2 border-cyan-500/50 p-8 rounded-lg text-center transform transition-all duration-300 w-full max-w-sm ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 hover:border-cyan-400 hover:neon-box cursor-pointer'}`} 
        onClick={!disabled ? onSelect : undefined}
    >
        <h3 className="text-3xl font-orbitron text-cyan-300 mb-4 text-glow">{title}</h3>
        <p className="text-gray-300 mb-6">{description}</p>
        <button 
            className="bg-cyan-500 text-black font-bold py-2 px-6 rounded-md hover:bg-cyan-300 transition-colors duration-200"
            disabled={disabled}
            onClick={!disabled ? onSelect : undefined}
        >
            {disabled ? 'Coming Soon' : `Select ${title}`}
        </button>
    </div>
);


export const RoleSelection: React.FC<RoleSelectionProps> = ({ onSelectRole }) => {
  return (
    <div className="min-h-screen bg-gray-900/80 flex flex-col items-center justify-center p-4">
      <h1 className="text-6xl font-orbitron text-cyan-400 mb-2 text-glow glitch">QUANTUM HEIST</h1>
      <p className="text-xl text-gray-300 mb-12">Design quantum circuits to execute the ultimate digital infiltration.</p>
      <div className="flex flex-col lg:flex-row gap-8">
        <RoleCard 
            role="hacker" 
            title="Hacker"
            description="Run point on the infiltration. Design and execute quantum circuits to bypass security systems in real-time."
            onSelect={() => onSelectRole('hacker')}
        />
        <RoleCard 
            role="analyst" 
            title="Analyst"
            description="The defensive specialist. Analyze quantum attack vectors and design counter-measures."
            onSelect={() => onSelectRole('analyst')}
        />
        <RoleCard 
            role="strategist" 
            title="Strategist"
            description="The mastermind. Manage resources and choose high-level approaches for the heist."
            onSelect={() => onSelectRole('strategist')}
            disabled={false}
        />
      </div>
    </div>
  );
};
