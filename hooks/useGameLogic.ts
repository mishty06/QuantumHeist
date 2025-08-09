



import { useState, useCallback } from 'react';
import { GameState, Role, Puzzle, Circuit, CircuitGate, GateType, SimulationResult, ActiveGateInfo } from '../types';
import { HACKER_PUZZLES, ANALYST_PUZZLES, STRATEGIST_PUZZLES, GATES } from '../constants';
import * as geminiService from '../services/geminiService';

const getPuzzlesForRole = (role: Role): Puzzle[] => {
    switch (role) {
        case 'hacker':
            return HACKER_PUZZLES;
        case 'analyst':
            return ANALYST_PUZZLES;
        case 'strategist':
            return STRATEGIST_PUZZLES;
        default:
            return HACKER_PUZZLES;
    }
};

export const useGameLogic = () => {
    console.log('useGameLogic hook is loading...');
    const [gameState, setGameState] = useState<GameState>('role-select');
    const [role, setRole] = useState<Role | null>(null);
    const [allPuzzles, setAllPuzzles] = useState<Puzzle[]>(HACKER_PUZZLES);
    const [currentPuzzleIndex, setCurrentPuzzleIndex] = useState(0);
    const [puzzle, setPuzzle] = useState<Puzzle>(HACKER_PUZZLES[0]);
    const [circuit, setCircuit] = useState<Circuit>(HACKER_PUZZLES[0].initialCircuit);
    const [activeGate, setActiveGate] = useState<ActiveGateInfo | null>(null);
    const [strategyAllocation, setStrategyAllocation] = useState<Record<string, number>>({});
    const [isLoading, setIsLoading] = useState(false);
    const [narrative, setNarrative] = useState('');
    const [dialogue, setDialogue] = useState('');
    const [results, setResults] = useState<Record<string, number> | null>(null);
    const [educationalContent, setEducationalContent] = useState({ title: '', text: '' });
    const [inputPrompt, setInputPrompt] = useState<{ message: string } | null>(null); // Added for InputPrompt.tsx

    const startPuzzle = useCallback((puzzleIndex: number, puzzleSet: Puzzle[]) => {
        const newPuzzle = puzzleSet[puzzleIndex];
        if (!newPuzzle) {
            setGameState('game-over');
            setDialogue("Congratulations, Agent! You have successfully navigated the quantum landscape and completed all available missions for this role.");
            return;
        }
        setPuzzle(newPuzzle);
        setCircuit(newPuzzle.initialCircuit);
        setNarrative(`Objective: ${newPuzzle.objective}`);
        setResults(null);
        setActiveGate(null);

        if (newPuzzle.puzzleType === 'strategy' && newPuzzle.strategy) {
            const initialAllocation = newPuzzle.strategy.categories.reduce((acc, cat) => {
                acc[cat.id] = 0;
                return acc;
            }, {} as Record<string, number>);
            setStrategyAllocation(initialAllocation);
        }

        setGameState('puzzle');
    }, []);
    
    const selectRole = (selectedRole: Role) => {
        setRole(selectedRole);
        const newPuzzleSet = getPuzzlesForRole(selectedRole);
        setAllPuzzles(newPuzzleSet);
        setCurrentPuzzleIndex(0);
        startPuzzle(0, newPuzzleSet);
    };

    const resetGame = () => {
        setGameState('role-select');
        setRole(null);
        setCurrentPuzzleIndex(0);
    };

    const advanceToNextPuzzle = () => {
        const nextPuzzleIndex = currentPuzzleIndex + 1;
        setCurrentPuzzleIndex(nextPuzzleIndex);
        startPuzzle(nextPuzzleIndex, allPuzzles);
    };

    const selectGate = (gateType: GateType | null) => {
        if (!gateType) {
            setActiveGate(null);
            return;
        }
        if (!activeGate || activeGate.type !== gateType || activeGate.controlQubit === undefined) {
             setActiveGate({ type: gateType });
        }
    };
    
    const addGate = (qubit: number, step: number) => {
        if (!activeGate || activeGate.type === 'DEL' || puzzle.puzzleType !== 'construct') return;

        const gateInfo = GATES.find(g => g.id === activeGate.type);
        if (!gateInfo) return;

        const isOccupied = circuit.steps[step].some(g => g.qubit === qubit || g.controlQubit === qubit);
        if (isOccupied) return;

        const isPendingCNOT = activeGate.type === 'CX' && activeGate.controlQubit !== undefined;

        if (isPendingCNOT) {
            if (activeGate.controlQubit === qubit) return;
            if (activeGate.controlStep !== step) {
                setActiveGate(null);
                return;
            }
            const newGate: CircuitGate = {
                id: `g-${Date.now()}`, gate: gateInfo, qubit: qubit, controlQubit: activeGate.controlQubit,
            };
            setCircuit(prev => {
                const newSteps = [...prev.steps];
                newSteps[step] = [...newSteps[step], newGate];
                return { ...prev, steps: newSteps };
            });
            setActiveGate(null);
        } else {
            if (activeGate.type === 'CX') {
                setActiveGate({ type: 'CX', controlQubit: qubit, controlStep: step });
            } else {
                const newGate: CircuitGate = { id: `g-${Date.now()}`, gate: gateInfo, qubit: qubit };
                setCircuit(prev => {
                    const newSteps = [...prev.steps];
                    newSteps[step] = [...newSteps[step], newGate];
                    return { ...prev, steps: newSteps };
                });
                setActiveGate(null);
            }
        }
    };

    const removeGate = (gateId: string) => {
        if (puzzle.puzzleType === 'analyze') return;
        setCircuit(prev => ({ ...prev, steps: prev.steps.map(step => step.filter(g => g.id !== gateId)) }));
    };

    const updateStrategyAllocation = (categoryId: string, value: number) => {
        setStrategyAllocation(prev => {
            const currentTotal = Object.values(prev).reduce((sum, v) => sum + v, 0);
            const remaining = (puzzle.strategy?.totalPoints || 0) - (currentTotal - (prev[categoryId] || 0));
            const newValue = Math.min(value, remaining);
            return { ...prev, [categoryId]: newValue };
        });
    };
    
    const handleSuccess = async (resultData: any) => {
        const eduText = await geminiService.getEducationalText(puzzle.educationalTopic.key);
        setEducationalContent({ title: puzzle.educationalTopic.title, text: eduText });
        const dynamicNarrative = await geminiService.getDynamicNarrative(puzzle.narrativePrompt, { success: true, counts: resultData });
        setDialogue(dynamicNarrative);
        setTimeout(() => setGameState('dialogue'), 500);
    };

    const handleFailure = async (resultData: any) => {
        const dynamicNarrative = await geminiService.getDynamicNarrative(puzzle.narrativePrompt, { success: false, counts: resultData });
        setNarrative(dynamicNarrative);
    };

    const runCircuit = async () => {
        if (puzzle.puzzleType !== 'construct') return;
        setIsLoading(true);
        setNarrative('Simulating quantum circuit...');
        const simulationCounts = await geminiService.executeQuantumCircuit(circuit);
        if (!simulationCounts) {
            setNarrative('Simulation failed. Quantum interference, perhaps? Check the console.');
            setIsLoading(false);
            return;
        }
        setResults(simulationCounts);
        const isSuccess = puzzle.successCondition(simulationCounts, circuit);
        if (isSuccess) { await handleSuccess(simulationCounts); } else { await handleFailure(simulationCounts); }
        setIsLoading(false);
    };

    const submitAnalysis = async (selectedOption: string) => {
        if (puzzle.puzzleType !== 'analyze' || !puzzle.analysis) return;
        setIsLoading(true);
        setNarrative('Submitting analysis...');
        const isSuccess = selectedOption === puzzle.analysis.correct;
        if (isSuccess) { await handleSuccess({}); } else { await handleFailure({}); }
        setIsLoading(false);
    };

    const submitStrategy = async () => {
        if (puzzle.puzzleType !== 'strategy') return;
        setIsLoading(true);
        setNarrative('Executing strategy...');
        const isSuccess = puzzle.successCondition(strategyAllocation, circuit);
        // Using a short delay to make the simulation feel more impactful
        await new Promise(res => setTimeout(res, 1000));
        if (isSuccess) { await handleSuccess(strategyAllocation); } else { await handleFailure(strategyAllocation); }
        setIsLoading(false);
    };

    const submitInput = useCallback((value: string) => {
        console.log('Input submitted, but this feature is not yet connected:', value);
        setInputPrompt(null);
    }, []);
    
    return {
        gameState, role, puzzle, circuit, activeGate, isLoading, narrative, dialogue, results, educationalContent, inputPrompt, strategyAllocation, currentPuzzleIndex,
        selectRole, resetGame, advanceToNextPuzzle, addGate, removeGate, selectGate, runCircuit, submitAnalysis, submitStrategy, updateStrategyAllocation, submitInput,
    };
};