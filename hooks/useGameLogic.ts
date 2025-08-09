
import { useState, useCallback, useEffect } from 'react';
import { GameState, Role, Level, Node, LogEntry, ToolId, NodeStatus } from '../types';
import { LEVELS } from '../constants';
import * as geminiService from '../services/geminiService';

const isPrime = (num: number) => {
    for(let i = 2, s = Math.sqrt(num); i <= s; i++)
        if(num % i === 0) return false; 
    return num > 1;
}

export const useGameLogic = () => {
    const [gameState, setGameState] = useState<GameState>('role-select');
    const [role, setRole] = useState<Role | null>(null);
    const [currentLevelIndex, setCurrentLevelIndex] = useState(0);
    const [level, setLevel] = useState<Level>(LEVELS[0]);
    const [nodes, setNodes] = useState<Node[]>(LEVELS[0].network);
    const [logs, setLogs] = useState<LogEntry[]>([]);
    const [activeTool, setActiveTool] = useState<ToolId>('info');
    const [isLoading, setIsLoading] = useState(false);
    const [educationalContent, setEducationalContent] = useState({ title: '', text: '' });
    const [inputPrompt, setInputPrompt] = useState<{
        nodeId: string;
        challenge: 'password' | 'factors';
        message: string;
        data: { correctAnswer: string };
    } | null>(null);

    const addLog = useCallback((text: string, type: LogEntry['type']) => {
        const newLog = {
            id: Date.now() + Math.random(),
            text,
            type,
            timestamp: new Date().toLocaleTimeString()
        };
        setLogs(prev => [...prev, newLog].slice(-50));
    }, []);

    const startLevel = useCallback((levelIndex: number) => {
        const newLevel = LEVELS[levelIndex];
        if (!newLevel) {
            setGameState('game-over');
            addLog("Congratulations, you've completed all available scenarios!", 'success');
            return;
        }
        setLevel(newLevel);
        setNodes(newLevel.network);
        setGameState('playing');
        setActiveTool('info');
        setLogs([]);
        addLog(`Initializing Scenario: ${newLevel.name}`, 'system');
        addLog(`Objective: ${newLevel.hackerObjective}`, 'info');
    }, [addLog]);
    
    const selectRole = (selectedRole: Role) => {
        setRole(selectedRole);
        startLevel(0);
    };

    const advanceToNextLevel = () => {
        const nextLevelIndex = currentLevelIndex + 1;
        setCurrentLevelIndex(nextLevelIndex);
        startLevel(nextLevelIndex);
    };

    const updateNodeStatus = (nodeId: string, status: NodeStatus) => {
        setNodes(prevNodes => prevNodes.map(n => n.id === nodeId ? { ...n, status } : n));
    };

    const handleLevelCompletion = useCallback(async () => {
        setIsLoading(true);
        addLog(`Success! Objective complete.`, 'success');
        const content = await geminiService.getEducationalText(level.educationalTopic.key);
        setEducationalContent({ title: level.educationalTopic.title, text: content });
        setGameState('level-complete');
        setIsLoading(false);
    }, [level, addLog]);
    
    useEffect(() => {
        if (gameState === 'playing' && level.successCondition(nodes)) {
            handleLevelCompletion();
        }
    }, [nodes, level, gameState, handleLevelCompletion]);
    
    const resetNodeToDefault = (nodeId: string) => {
        const node = nodes.find(n => n.id === nodeId);
        if (node && node.status !== 'breached' && node.status !== 'probed') {
           setTimeout(() => updateNodeStatus(nodeId, 'default'), 1000);
        }
    };

    const useTool = async (toolId: ToolId, nodeId: string | null) => {
        if (isLoading || !nodeId) return;

        const targetNode = nodes.find(n => n.id === nodeId);
        if (!targetNode) return;

        setIsLoading(true);
        addLog(`Executing [${toolId}] on [${targetNode.name}]...`, 'player');
        updateNodeStatus(nodeId, 'target');

        try {
            switch (toolId) {
                case 'info':
                    updateNodeStatus(nodeId, 'probed');
                    addLog(`Probing ${targetNode.name}...`, 'info');
                    if (targetNode.data?.content) {
                        addLog(`Retrieved data: ${targetNode.data.content}`, 'info');
                    } else if (targetNode.vulnerability?.type === 'rsa') {
                        addLog(`RSA encryption detected. Public modulus: ${targetNode.vulnerability.data.modulus}`, 'info');
                    } else {
                        addLog('No immediate vulnerabilities detected.', 'info');
                    }
                    setIsLoading(false);
                    break;

                case 'qrng_analyzer':
                     if (targetNode.vulnerability?.type === 'password_sequence') {
                        addLog('Analyzing QRNG stream from router...', 'gemini');
                        const result = await geminiService.simulateQRNG(20, 50);
                        if (result) {
                            addLog(`QRNG sequence detected: ${result.numbers.join(', ')}`, 'info');
                            const primePassword = result.numbers.filter(isPrime).slice(0, targetNode.vulnerability.data.primes_count).join('');
                            addLog(`Hint from phone notification suggests a password based on prime numbers. The password is the first ${targetNode.vulnerability.data.primes_count} primes concatenated.`, 'system');
                            setInputPrompt({
                                nodeId,
                                challenge: 'password',
                                message: `The QRNG stream is exposed. Deduce the password to access ${targetNode.name}.`,
                                data: { correctAnswer: primePassword }
                            });
                        } else {
                            addLog('QRNG analysis failed. Quantum interference?', 'error');
                            resetNodeToDefault(nodeId);
                        }
                    } else {
                        addLog('Tool is not effective on this target.', 'error');
                        resetNodeToDefault(nodeId);
                    }
                    setIsLoading(false);
                    break;
                
                case 'shors_algorithm':
                    if (targetNode.vulnerability?.type === 'rsa') {
                        const modulus = targetNode.vulnerability.data.modulus;
                        addLog(`Executing Shor's algorithm on modulus ${modulus}... This may take a moment.`, 'gemini');
                        const result = await geminiService.simulateShor(modulus);
                        if (result && result.factors.length > 0) {
                            addLog(`Quantum analysis complete. Factors found: ${result.factors.join(', ')}.`, 'success');
                            setInputPrompt({
                                nodeId,
                                challenge: 'factors',
                                message: `Shor's algorithm succeeded. Enter the factors for ${modulus} separated by a comma (e.g., 13,17) to decrypt the vault.`,
                                data: { correctAnswer: result.factors.sort((a,b) => a-b).join(',') }
                            });
                        } else {
                            addLog('Factoring failed. The quantum state decohered.', 'error');
                            resetNodeToDefault(nodeId);
                        }
                    } else {
                         addLog('Target is not vulnerable to this attack.', 'error');
                         resetNodeToDefault(nodeId);
                    }
                    setIsLoading(false);
                    break;
                default:
                    addLog(`Tool [${toolId}] not implemented.`, 'error');
                    setIsLoading(false);
            }
        } catch (e) {
            console.error(e);
            addLog('A critical error occurred.', 'error');
            setIsLoading(false);
            resetNodeToDefault(nodeId);
        }
    };
    
    const submitInput = (value: string) => {
        if (!inputPrompt) return;
        const { nodeId, challenge, data } = inputPrompt;
        let isCorrect = false;

        if (challenge === 'password') {
            if (value === data.correctAnswer) {
                isCorrect = true;
            }
        } else if (challenge === 'factors') {
            const submittedFactors = value.split(',').map(s => parseInt(s.trim(), 10)).filter(n => !isNaN(n)).sort((a,b) => a-b).join(',');
            if (submittedFactors === data.correctAnswer) {
                isCorrect = true;
            }
        }

        if (isCorrect) {
            addLog(`Correct! Access granted to ${nodes.find(n => n.id === nodeId)?.name}.`, 'success');
            updateNodeStatus(nodeId, 'breached');
        } else {
            addLog('Incorrect input. Access denied.', 'error');
            updateNodeStatus(nodeId, 'default');
        }
        setInputPrompt(null);
    };

    const cancelInput = () => {
        if (!inputPrompt) return;
        const { nodeId } = inputPrompt;
        addLog('Input cancelled.', 'system');
        updateNodeStatus(nodeId, 'default');
        setInputPrompt(null);
    };

    return {
        gameState,
        role,
        level,
        nodes,
        logs,
        activeTool,
        isLoading,
        educationalContent,
        inputPrompt,
        selectRole,
        useTool,
        setActiveTool,
        advanceToNextLevel,
        submitInput,
        cancelInput,
    };
};
