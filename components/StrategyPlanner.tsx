
import React from 'react';
import { Puzzle } from '../types';

interface StrategyPlannerProps {
  puzzle: Puzzle;
  allocation: Record<string, number>;
  onUpdateAllocation: (categoryId: string, value: number) => void;
}

export const StrategyPlanner: React.FC<StrategyPlannerProps> = ({ puzzle, allocation, onUpdateAllocation }) => {
    if (puzzle.puzzleType !== 'strategy' || !puzzle.strategy) {
        return null;
    }

    const { categories, totalPoints } = puzzle.strategy;
    const usedPoints = Object.values(allocation).reduce((sum, points) => sum + points, 0);
    const remainingPoints = totalPoints - usedPoints;

    return (
        <div className="h-full bg-black/50 p-6 relative overflow-auto">
            <h2 className="text-2xl font-orbitron text-cyan-400 border-b-2 border-cyan-500/30 pb-2 mb-6 text-glow">Strategy Planner</h2>
            
            <div className="bg-gray-800/50 p-4 rounded-lg border border-purple-500/50 mb-6 text-center">
                <p className="text-lg font-orbitron text-gray-300">Total Resource Points</p>
                <p className="text-5xl font-orbitron text-purple-400 text-glow">{totalPoints}</p>
                <p className="text-md text-gray-400">Points Remaining: <span className="font-bold text-white">{remainingPoints}</span></p>
            </div>

            <div className="space-y-6">
                {categories.map(category => (
                    <div key={category.id} className="bg-gray-900/70 p-4 rounded-md border border-gray-700">
                        <div className="flex justify-between items-baseline mb-2">
                             <h3 className="text-xl font-orbitron text-purple-300">{category.name}</h3>
                             <span className="text-2xl font-mono font-bold text-white bg-black px-2 py-1 rounded">{allocation[category.id] || 0}</span>
                        </div>
                       
                        <p className="text-sm text-gray-400 mb-3">{category.description}</p>
                        <input
                            type="range"
                            min="0"
                            max={totalPoints}
                            step="1"
                            value={allocation[category.id] || 0}
                            onChange={(e) => {
                                const newValue = parseInt(e.target.value, 10);
                                const currentTotal = Object.values(allocation).reduce((sum, v) => sum + v, 0);
                                const otherPoints = currentTotal - (allocation[category.id] || 0);
                                if (otherPoints + newValue <= totalPoints) {
                                    onUpdateAllocation(category.id, newValue)
                                }
                            }}
                            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};
