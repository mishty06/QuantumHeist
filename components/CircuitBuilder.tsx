

import React from 'react';
import { ActiveGateInfo, Circuit } from '../types';
import { GateIcon, CnotGateControlIcon, CnotGateTargetIcon } from './icons';

interface CircuitBuilderProps {
  circuit: Circuit;
  onAddGate: (qubit: number, step: number) => void;
  onRemoveGate: (gateId: string) => void;
  activeGate: ActiveGateInfo | null;
  isReadOnly: boolean;
}

export const CircuitBuilder: React.FC<CircuitBuilderProps> = ({ circuit, onAddGate, onRemoveGate, activeGate, isReadOnly }) => {
  const steps = circuit.steps.length;
  const isPendingCNOT = activeGate && activeGate.type === 'CX' && activeGate.controlQubit !== undefined;

  const isDeleteMode = activeGate && activeGate.type === 'DEL';

  return (
    <div className="h-full bg-black/50 p-6 relative overflow-auto">
      {isReadOnly && (
        <div className="absolute inset-0 bg-black/70 z-10 flex items-center justify-center pointer-events-none">
            <div className="text-center p-4 border-2 border-yellow-400/80 rounded-lg bg-yellow-900/30">
                <p className="text-2xl font-orbitron text-yellow-400 text-glow">
                    ANALYSIS MODE
                </p>
                <p className="text-yellow-200/80">Circuit is read-only.</p>
            </div>
        </div>
      )}
      <h2 className="text-2xl font-orbitron text-cyan-400 border-b-2 border-cyan-500/30 pb-2 mb-6 text-glow">Circuit Canvas</h2>
      <div className="grid gap-y-8">
        {[...Array(circuit.qubits)].map((_, qIndex) => {
          const cnotLinkages = [];
          for(let stepIndex = 0; stepIndex < steps; stepIndex++) {
              const cxGate = circuit.steps[stepIndex].find(g => g.gate.id === 'CX' && (g.qubit === qIndex || g.controlQubit === qIndex));
              if (cxGate && cxGate.controlQubit !== undefined && cxGate.qubit !== -1) {
                  const isControl = cxGate.controlQubit === qIndex;
                  const targetQubit = isControl ? cxGate.qubit : cxGate.controlQubit!;
                  const startY = Math.min(qIndex, targetQubit);
                  const endY = Math.max(qIndex, targetQubit);

                  cnotLinkages.push(
                      <div
                          key={`cnot-link-${stepIndex}-${qIndex}`}
                          className="absolute bg-current"
                          style={{
                              left: `calc(${(stepIndex + 0.5) * (100 / steps)}% - 1px)`,
                              top: `${(startY * 5) + 3}rem`,
                              width: '2px',
                              height: `${(endY - startY) * 5}rem`,
                              transform: 'translateX(-50%)'
                          }}
                      />
                  );
              }
          }

          return (
            <div key={qIndex} className="relative">
              {cnotLinkages}
              <div className="grid" style={{ gridTemplateColumns: `repeat(${steps}, 1fr)` }}>
                {[...Array(steps)].map((_, stepIndex) => (
                  <div key={stepIndex} className="relative flex items-center justify-center h-16">
                    <div className="absolute w-full h-0.5 bg-cyan-600/50"></div>
                     <div
                        className={`relative w-12 h-12 flex items-center justify-center rounded-md border border-dashed border-transparent transition-all ${activeGate && !isReadOnly && !isDeleteMode ? 'hover:border-cyan-400 hover:bg-cyan-900/50 cursor-pointer' : ''}`}
                        onClick={() => { if(!isReadOnly && activeGate && !isDeleteMode) onAddGate(qIndex, stepIndex)}}
                    >
                      {circuit.steps[stepIndex]
                        .filter(g => (g.gate.qubits === 1 && g.qubit === qIndex) || (g.gate.id === 'CX' && (g.qubit === qIndex || g.controlQubit === qIndex)))
                        .map(gateInstance => {
                           const gateContent = () => {
                             if (gateInstance.gate.id === 'CX') {
                               if (gateInstance.controlQubit === qIndex) return <CnotGateControlIcon key={gateInstance.id}/>;
                               if (gateInstance.qubit === qIndex) return <CnotGateTargetIcon key={gateInstance.id}/>;
                             }
                             return <GateIcon key={gateInstance.id} type={gateInstance.gate.id} />;
                           }
                           return (
                               <div 
                                key={gateInstance.id}
                                onClick={() => { if(!isReadOnly && isDeleteMode) onRemoveGate(gateInstance.id) }}
                                className={`p-2 rounded-md transition-all ${!isReadOnly && isDeleteMode ? 'cursor-pointer hover:bg-red-500/50' : ''}`}
                               >
                                {gateContent()}
                               </div>
                           )
                        })}
                      {!isReadOnly && isPendingCNOT && activeGate.controlQubit === qIndex && activeGate.controlStep === stepIndex && (
                        <div className="animate-pulse">
                            <CnotGateControlIcon />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <div className="absolute -left-12 top-1/2 -translate-y-1/2 font-bold text-lg text-cyan-300">
                |q<sub>{qIndex}</sub>&gt;
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};