import React from 'react';
import { GateType, NodeType } from '../types';

export const HadamardGateIcon = () => (
    <div className="w-8 h-8 border-2 border-current flex items-center justify-center font-bold text-lg">H</div>
);

export const PauliXGateIcon = () => (
    <div className="w-8 h-8 border-2 border-current rounded-full flex items-center justify-center font-bold text-2xl">+</div>
);

export const CnotGateTargetIcon = () => (
     <div className="w-8 h-8 border-2 border-current rounded-full flex items-center justify-center">
        <div className="w-2 h-8 bg-current"></div>
        <div className="w-8 h-2 bg-current absolute"></div>
    </div>
);

export const CnotGateControlIcon = () => (
     <div className="w-6 h-6 bg-current rounded-full"></div>
);

export const MeasureGateIcon = () => (
    <div className="w-8 h-8 border-2 border-current flex items-center justify-center p-0.5">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-full w-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 19V6.5c0-1.1.9-2 2-2h12c1.1 0 2 .9 2 2V19M4 19c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2M4 19h16M8 13l4-4 4 4" />
        </svg>
    </div>
);

export const TrashIcon = () => (
    <div className="w-8 h-8 flex items-center justify-center p-0.5">
         <svg xmlns="http://www.w3.org/2000/svg" className="h-full w-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
    </div>
);

export const GateIcon: React.FC<{ type: GateType }> = ({ type }) => {
    switch (type) {
        case 'H': return <HadamardGateIcon />;
        case 'X': return <PauliXGateIcon />;
        case 'M': return <MeasureGateIcon />;
        case 'CX': return <CnotGateTargetIcon />; // Placeholder, CNOT is more complex
        case 'DEL': return <TrashIcon />;
        default: return null;
    }
};

// Added to resolve error in unused NetworkMap component
export const NodeIcon: React.FC<{ type: NodeType }> = ({ type }) => (
    <div className="w-12 h-12 border-2 border-current rounded-md flex items-center justify-center font-mono text-xs">
        {type.slice(0, 4).toUpperCase()}
    </div>
);