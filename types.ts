
import React from 'react';

export type Role = 'hacker' | 'analyst' | 'strategist';

export type GameState = 'role-select' | 'puzzle' | 'dialogue' | 'game-over';

export type GateType = 'H' | 'X' | 'CX' | 'M' | 'DEL';

export interface Gate {
    id: GateType;
    name: string;
    description: string;
    qubits: number; // How many qubits this gate acts on (1 or 2)
}

export interface CircuitGate {
    id: string; // unique instance id
    gate: Gate;
    qubit: number; // The primary qubit index (or target for CX)
    controlQubit?: number; // For controlled gates like CNOT
}

export interface Circuit {
    qubits: number;
    steps: CircuitGate[][]; // An array of steps, where each step is an array of gates
}

export interface StrategyCategory {
    id: string;
    name: string;
    description: string;
}

export interface Puzzle {
    id: number;
    name: string;
    objective: string;
    puzzleType: 'construct' | 'analyze' | 'strategy';
    analysis?: {
        options: string[];
        correct: string;
    };
    strategy?: {
        categories: StrategyCategory[];
        totalPoints: number;
    };
    initialCircuit: Circuit;
    availableGates: GateType[];
    narrativePrompt: string;
    successCondition: (resultData: any, circuit: Circuit) => boolean;
    educationalTopic: {
        title: string;
        key: string;
    };
}

export interface SimulationResult {
    counts: Record<string, number>;
    success: boolean;
}

export interface ActiveGateInfo {
  type: GateType;
  // For pending CNOT gates
  controlQubit?: number;
  controlStep?: number;
}


// Types for unused components to resolve errors
export type ToolId = string;

export interface Tool {
    id: ToolId;
    name: string;
    description: string;
    roles: Role[];
    icon: React.ReactNode;
}

export type NodeType = 'server' | 'firewall' | 'database' | 'proxy';

export interface Node {
    id: string;
    name: string;
    type: NodeType;
    status: 'default' | 'probed' | 'breached' | 'secured' | 'target' | 'immune';
    position: { top: string; left: string; };
    connections: string[];
}

export interface LogEntry {
    id: number;
    timestamp: string;
    type: 'info' | 'success' | 'error' | 'system' | 'player' | 'gemini';
    text: string;
}
