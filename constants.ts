
import { Gate, Puzzle, Tool } from './types';

export const GATES: Gate[] = [
    { id: 'H', name: 'Hadamard Gate', description: 'Puts a qubit into a superposition of |0> and |1>.', qubits: 1 },
    { id: 'X', name: 'Pauli-X Gate', description: 'Flips a qubit\'s state (0->1, 1->0). Also known as a NOT gate.', qubits: 1 },
    { id: 'CX', name: 'CNOT Gate', description: 'Controlled-NOT. Flips the target qubit if the control qubit is |1>. Creates entanglement.', qubits: 2 },
    { id: 'M', name: 'Measurement', description: 'Measures a qubit, collapsing its superposition to a classical bit (0 or 1).', qubits: 1 },
];

export const HACKER_PUZZLES: Puzzle[] = [
    {
        id: 1,
        name: "Superposition Lock",
        objective: "The vault's primary lock is quantum. It will only open if its single qubit is in a perfect superposition. Use a Hadamard gate to prepare the state, then measure it.",
        puzzleType: 'construct',
        initialCircuit: { qubits: 1, steps: [[], [], []] },
        availableGates: ['H', 'X', 'M'],
        narrativePrompt: "The player is facing a high-tech vault door with a single, glowing qubit interface. The goal is to put this qubit in superposition.",
        successCondition: (results, circuit) => {
            const hasHadamard = circuit.steps.flat().some(g => g.gate.id === 'H');
            const hasMeasurement = circuit.steps.flat().some(g => g.gate.id === 'M');
            return hasHadamard && hasMeasurement;
        },
        educationalTopic: { title: "Superposition", key: "Superposition" }
    },
    {
        id: 2,
        name: "Entanglement Key",
        objective: "A two-factor authentication system requires two entangled qubits. Create a Bell state (|00> + |11>) by putting one qubit in superposition and then entangling it with a second qubit using a CNOT gate.",
        puzzleType: 'construct',
        initialCircuit: { qubits: 2, steps: [[], [], [], []] },
        availableGates: ['H', 'X', 'CX', 'M'],
        narrativePrompt: "The player needs to bypass a dual-key system. The system requires two qubits to be entangled in a Bell state to unlock.",
        successCondition: (results, circuit) => {
            const hGate = circuit.steps.flat().find(g => g.gate.id === 'H');
            const cxGate = circuit.steps.flat().find(g => g.gate.id === 'CX');
            const mGates = circuit.steps.flat().filter(g => g.gate.id === 'M').length;
            
            const bellStateSignature = (results['00'] || 0) > 400 && (results['11'] || 0) > 400 && (results['01'] || 0) < 100 && (results['10'] || 0) < 100;

            return !!hGate && !!cxGate && mGates >= 2 && bellStateSignature;
        },
        educationalTopic: { title: "Entanglement", key: "Entanglement" }
    },
    {
        id: 3,
        name: "Quantum Teleportation",
        objective: "Teleport the state of |q0> (the source) to |q2> (the target) using an entangled pair (|q1>, |q2>). Note: You won't create the initial entanglement, just perform the teleportation protocol itself.",
        puzzleType: 'construct',
        initialCircuit: { qubits: 3, steps: [[], [], [], [], []] },
        availableGates: ['CX', 'H', 'M'],
        narrativePrompt: "You need to send a quantum key to an operative across the network without physically transmitting the qubit. Use quantum teleportation to transmit its state instantly.",
        successCondition: (results, circuit) => {
            const cxGate = circuit.steps.flat().find(g => g.gate.id === 'CX' && g.controlQubit === 0 && g.qubit === 1);
            const hGate = circuit.steps.flat().find(g => g.gate.id === 'H' && g.qubit === 0);
            const mGates = circuit.steps.flat().filter(g => g.gate.id === 'M').length;
            // Simplified check: looks for the core teleportation gates in the right order
            return !!cxGate && !!hGate && mGates >= 2;
        },
        educationalTopic: { title: "Quantum Teleportation", key: "QuantumTeleportation" }
    },
    {
        id: 4,
        name: "Error Correction Encoding",
        objective: "The data channel is noisy. Protect the logical qubit |q0> from bit-flip errors by encoding its state across two other physical qubits using a repetition code.",
        puzzleType: 'construct',
        initialCircuit: { qubits: 3, steps: [[], [], [], []] },
        availableGates: ['CX', 'M'],
        narrativePrompt: "Data corruption is high on the next channel. Encode your logical qubit using a simple 3-qubit repetition code to protect it from bit-flip noise.",
        successCondition: (results, circuit) => {
            const cxGates = circuit.steps.flat().filter(g => g.gate.id === 'CX');
            // Check for two CNOTs originating from the logical qubit q0
            const correctEncoding = cxGates.length === 2 && cxGates.every(g => g.controlQubit === 0);
            return correctEncoding;
        },
        educationalTopic: { title: "Quantum Error Correction", key: "QuantumErrorCorrection" }
    },
];

export const ANALYST_PUZZLES: Puzzle[] = [
    {
        id: 1,
        name: "QKD Eavesdropping Detected",
        objective: "An unusually high Quantum Bit Error Rate (QBER) of 15% is detected on a secure channel. Analyze the situation and select the appropriate response.",
        puzzleType: 'analyze',
        analysis: {
            options: ["Ignore Anomaly", "Re-route to Backup", "Reset and Secure Channel"],
            correct: "Reset and Secure Channel"
        },
        initialCircuit: { qubits: 1, steps: [[]] },
        availableGates: [],
        narrativePrompt: "As an analyst, you see a critical alert: QBER is at 15% on the primary communication line. This rate is far too high to be natural noise.",
        successCondition: () => false, // Not used for analysis puzzles
        educationalTopic: { title: "Quantum Key Distribution (QKD)", key: "QKD" }
    },
    {
        id: 2,
        name: "Attack Vector Identification",
        objective: "An attacker's quantum program has been captured targeting the firewall. Analyze the circuit and identify the algorithm being used.",
        puzzleType: 'analyze',
        analysis: {
            options: ["Bell State Injection", "Grover's Algorithm", "Shor's Algorithm"],
            correct: "Grover's Algorithm"
        },
        initialCircuit: { 
            qubits: 2, 
            steps: [
                [{ id: 'g1', gate: GATES[0], qubit: 0 }, { id: 'g2', gate: GATES[0], qubit: 1 }],
                [{ id: 'g3', gate: GATES[2], qubit: 1, controlQubit: 0 }],
                [{ id: 'g4', gate: GATES[0], qubit: 0 }, { id: 'g5', gate: GATES[0], qubit: 1 }],
            ] 
        },
        availableGates: [],
        narrativePrompt: "Your honeypot captured this quantum circuit aimed at a database search function. You must identify the attack type to deploy the correct countermeasures.",
        successCondition: () => false, // Not used for analysis puzzles
        educationalTopic: { title: "Grover's Algorithm", key: "Grover" }
    },
    {
        id: 3,
        name: "Decoherence Analysis",
        objective: "A drone's navigation qubit should be in a 50/50 superposition, but diagnostics show results skewed 95% to |0>. The circuit is correct. What is the cause?",
        puzzleType: 'analyze',
        analysis: {
            options: ["Incorrect Gate", "Decoherence", "System Miscalibration"],
            correct: "Decoherence"
        },
        initialCircuit: {
            qubits: 1,
            steps: [
                [{ id: 'g1', gate: GATES[0], qubit: 0 }],
                [{ id: 'g2', gate: GATES[3], qubit: 0 }],
            ]
        },
        availableGates: [],
        narrativePrompt: "A friendly drone is malfunctioning. Its quantum navigation system, which relies on superposition, is failing. The measurements are heavily skewed, suggesting an external influence.",
        successCondition: () => false,
        educationalTopic: { title: "Decoherence", key: "Decoherence" }
    },
    {
        id: 4,
        name: "PQC Algorithm Selection",
        objective: "Upgrade a legacy database. The primary constraints are minimal key size and high performance for embedded systems. Choose the most suitable PQC algorithm.",
        puzzleType: 'analyze',
        analysis: {
            options: ["Kyber (Lattice-based)", "SPHINCS+ (Hash-based)", "Classic McEliece (Code-based)"],
            correct: "Kyber (Lattice-based)"
        },
        initialCircuit: { qubits: 0, steps: [[]] },
        availableGates: [],
        narrativePrompt: "You must choose a Post-Quantum Cryptography algorithm to secure field devices. The key size must be small, and performance must be high. Choose wisely.",
        successCondition: () => false,
        educationalTopic: { title: "Post-Quantum Cryptography", key: "PQC" }
    }
];

export const STRATEGIST_PUZZLES: Puzzle[] = [
    {
        id: 1,
        name: "Initial Deployment Strategy",
        objective: "Allocate your 10 Resource Points to balance Breach Speed, Stealth, and Data Analysis. A successful infiltration requires a balanced approach to bypass initial security without raising alarms.",
        puzzleType: 'strategy',
        strategy: {
            categories: [
                { id: 'speed', name: 'Breach Speed', description: 'How quickly your quantum tools operate.' },
                { id: 'stealth', name: 'Stealth', description: 'Your ability to avoid detection by classical systems.' },
                { id: 'analysis', name: 'Data Analysis', description: 'Efficiency in sifting through stolen quantum data.' },
            ],
            totalPoints: 10,
        },
        initialCircuit: { qubits: 0, steps: [[]] },
        availableGates: [],
        narrativePrompt: "As the heist's mastermind, you are planning the initial resource allocation. Your choices will determine the team's approach and their chances of success.",
        successCondition: (allocation) => {
            const { speed = 0, stealth = 0, analysis = 0 } = allocation;
            const total = speed + stealth + analysis;
            // Success requires at least 3 speed, 4 stealth, and not going over budget.
            return speed >= 3 && stealth >= 4 && total <= 10;
        },
        educationalTopic: { title: "Quantum Resource Management", key: "QuantumResourceManagement" }
    },
    {
        id: 2,
        name: "Mid-Heist Pivot",
        objective: "The analyst has detected an unexpected quantum firewall. Re-allocate 8 'Pivot Points' to determine how the team should adapt to this new threat.",
        puzzleType: 'strategy',
        strategy: {
            categories: [
                { id: 'bruteForce', name: 'Brute Force', description: 'Overwhelm the firewall with raw quantum computation.' },
                { id: 'sideChannel', name: 'Exploit Side-Channel', description: 'Look for unintended information leakage from the firewall.' },
                { id: 'tunneling', name: 'Quantum Tunneling', description: 'Use quantum effects to bypass the barrier entirely.' },
            ],
            totalPoints: 8,
        },
        initialCircuit: { qubits: 0, steps: [[]] },
        availableGates: [],
        narrativePrompt: "The mission has hit a snag: a quantum firewall. You must adapt. Allocate your team's focus to find a way through.",
        successCondition: (allocation) => {
            const { bruteForce = 0, sideChannel = 0, tunneling = 0 } = allocation;
            // Success requires a creative, non-obvious solution.
            return tunneling >= 4 && sideChannel >= 2 && bruteForce <= 2;
        },
        educationalTopic: { title: "Strategic Adaptation", key: "StrategicAdaptation" }
    },
    {
        id: 3,
        name: "The Escape Plan",
        objective: "The data is secured. Now, get the team out clean. Allocate 12 'Exfil Points' between Speed, Stealth, and creating a Diversion.",
        puzzleType: 'strategy',
        strategy: {
            categories: [
                { id: 'speed', name: 'Speed', description: 'A fast and direct escape route.' },
                { id: 'stealth', name: 'Stealth', description: 'Move through undetected channels and erase your tracks.' },
                { id: 'diversion', name: 'Diversion', description: 'Create a loud quantum event elsewhere to draw attention.' },
            ],
            totalPoints: 12,
        },
        initialCircuit: { qubits: 0, steps: [[]] },
        availableGates: [],
        narrativePrompt: "The hard part is over. Now for the extraction. Plan your team's exfiltration to avoid capture.",
        successCondition: (allocation) => {
            const { speed = 0, stealth = 0, diversion = 0 } = allocation;
            // A clean getaway requires high stealth and a good diversion.
            return stealth >= 5 && diversion >= 4 && speed >= 3;
        },
        educationalTopic: { title: "Risk Management", key: "RiskManagement" }
    }
];


// Added to resolve errors in unused components
export const TOOLS: Tool[] = [];
