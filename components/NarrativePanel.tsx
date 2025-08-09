import React from 'react';
import { Puzzle } from '../types';

interface NarrativePanelProps {
  puzzle: Puzzle;
  narrative: string;
  results: Record<string, number> | null;
  isLoading: boolean;
  onRunCircuit: () => void;
  onSubmitAnalysis: (option: string) => void;
  onSubmitStrategy: () => void;
}

export const NarrativePanel: React.FC<NarrativePanelProps> = ({ puzzle, narrative, results, isLoading, onRunCircuit, onSubmitAnalysis, onSubmitStrategy }) => {

  const totalShots = results ? Object.values(results).reduce((sum, count) => sum + count, 0) : 0;
  
  const renderActionButton = () => {
    switch(puzzle.puzzleType) {
        case 'construct':
            return (
                <button
                    onClick={onRunCircuit}
                    disabled={isLoading}
                    className="w-full bg-cyan-600 text-black font-bold py-3 px-6 rounded-md hover:bg-cyan-500 transition-colors duration-200 font-orbitron disabled:bg-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed flex items-center justify-center text-lg shadow-lg hover:shadow-cyan-500/50"
                >
                    {isLoading ? (
                        <>
                        <div className="w-5 h-5 border-2 border-dashed rounded-full animate-spin border-black mr-3"></div>
                        SIMULATING...
                        </>
                    ) : (
                        'RUN CIRCUIT'
                    )}
                </button>
            );
        case 'analyze':
            return (
                <div className="space-y-2">
                    <h3 className="text-lg font-orbitron text-cyan-300 text-glow mb-2">Analysis Options</h3>
                    {puzzle.analysis?.options.map(option => (
                        <button 
                            key={option}
                            onClick={() => onSubmitAnalysis(option)}
                            disabled={isLoading}
                            className="w-full bg-gray-800/70 text-cyan-300 font-bold py-2 px-4 rounded-md text-left transition-colors duration-200 hover:bg-cyan-800/90 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            &gt; {option}
                        </button>
                    ))}
                </div>
            );
        case 'strategy':
             return (
                <button
                    onClick={onSubmitStrategy}
                    disabled={isLoading}
                    className="w-full bg-purple-600 text-white font-bold py-3 px-6 rounded-md hover:bg-purple-500 transition-colors duration-200 font-orbitron disabled:bg-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed flex items-center justify-center text-lg shadow-lg hover:shadow-purple-500/50"
                >
                    {isLoading ? (
                        <>
                        <div className="w-5 h-5 border-2 border-dashed rounded-full animate-spin border-white mr-3"></div>
                        EXECUTING...
                        </>
                    ) : (
                        'SUBMIT STRATEGY'
                    )}
                </button>
            );
    }
  }

  return (
    <div className="bg-gray-900/50 h-full p-4 flex flex-col">
      <h2 className="text-2xl font-orbitron text-cyan-400 border-b-2 border-cyan-500/30 pb-2 mb-4 text-glow">System Log</h2>
      <div className="flex-grow overflow-y-auto pr-2 space-y-4">
        <p className="text-gray-300 whitespace-pre-wrap font-mono">{narrative}</p>
        
        {puzzle.puzzleType === 'construct' && results && (
          <div>
            <h3 className="text-lg font-orbitron text-cyan-300 text-glow mb-2">Measurement Results</h3>
            <div className="space-y-2 bg-gray-800/50 p-3 rounded-md">
              {Object.entries(results).map(([state, count]) => (
                <div key={state} className="flex items-center text-sm">
                  <span className="w-16 font-mono">|{state}{'>'}</span>
                  <div className="flex-grow bg-gray-700 rounded-full h-4">
                    <div 
                      className="bg-cyan-500 h-4 rounded-full" 
                      style={{ width: `${(count / totalShots) * 100}%` }}
                    />
                  </div>
                  <span className="w-16 text-right font-mono">{count}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="flex-shrink-0 pt-4 border-t-2 border-cyan-500/30">
        {renderActionButton()}
      </div>
    </div>
  );
};
