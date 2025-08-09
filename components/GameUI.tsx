


import React from 'react';
import { useGameLogic } from '../hooks/useGameLogic';
import { GatePanel } from './GatePanel';
import { CircuitBuilder } from './CircuitBuilder';
import { NarrativePanel } from './NarrativePanel';
import { StrategyPlanner } from './StrategyPlanner';

export const GameUI: React.FC<{ logic: ReturnType<typeof useGameLogic> }> = ({ logic }) => {
    if (!logic.role) return null;

    const currentPuzzleType = logic.puzzle.puzzleType;

    const renderMainPanel = () => {
        switch (currentPuzzleType) {
            case 'construct':
            case 'analyze':
                return (
                    <CircuitBuilder 
                        circuit={logic.circuit}
                        onAddGate={logic.addGate}
                        onRemoveGate={logic.removeGate}
                        activeGate={logic.activeGate}
                        isReadOnly={currentPuzzleType === 'analyze'}
                    />
                );
            case 'strategy':
                return (
                    <StrategyPlanner
                        puzzle={logic.puzzle}
                        allocation={logic.strategyAllocation}
                        onUpdateAllocation={logic.updateStrategyAllocation}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <div className="h-screen w-screen flex flex-col bg-gray-900 text-white">
            <header className="flex-shrink-0 p-3 bg-gray-950/70 border-b-2 border-cyan-600/50 flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-orbitron text-cyan-400 text-glow">Quantum Heist</h1>
                    <p className="text-sm text-cyan-200 mt-1 max-w-lg">{logic.puzzle.name}</p>
                </div>
                <div className="text-right">
                    <p className="text-lg font-bold">Puzzle {logic.currentPuzzleIndex + 1}</p>
                    <p className="text-sm text-gray-400">Role: {logic.role.charAt(0).toUpperCase() + logic.role.slice(1)}</p>
                </div>
            </header>

            <main className="flex-grow grid grid-cols-1 lg:grid-cols-12 min-h-0">
                {currentPuzzleType === 'construct' && (
                    <div className="lg:col-span-2 overflow-y-auto border-r-2 border-cyan-500/30">
                        <GatePanel 
                            availableGates={logic.puzzle.availableGates}
                            activeGate={logic.activeGate}
                            onSelectGate={logic.selectGate}
                        />
                    </div>
                )}
                
                <div className={`overflow-y-auto ${currentPuzzleType === 'construct' ? 'lg:col-span-7' : 'lg:col-span-9'}`}>
                    {renderMainPanel()}
                </div>

                <div className="lg:col-span-3 overflow-y-auto border-l-2 border-cyan-500/30">
                     <NarrativePanel 
                        puzzle={logic.puzzle}
                        narrative={logic.narrative}
                        results={logic.results}
                        isLoading={logic.isLoading}
                        onRunCircuit={logic.runCircuit}
                        onSubmitAnalysis={logic.submitAnalysis}
                        onSubmitStrategy={logic.submitStrategy}
                     />
                </div>
            </main>
        </div>
    );
};
