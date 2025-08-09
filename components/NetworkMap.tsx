import React from 'react';
import { Node, ToolId } from '../types';
import { NodeIcon } from './icons';

interface NetworkMapProps {
  nodes: Node[];
  onNodeClick: (nodeId: string) => void;
  isLoading: boolean;
  activeTool: ToolId;
}

const statusClasses: Record<Node['status'], string> = {
    default: 'border-cyan-700/50 text-cyan-400/70 hover:border-cyan-400 hover:text-cyan-300',
    probed: 'border-yellow-400 text-yellow-300 animate-pulse',
    breached: 'border-red-500 text-red-400 neon-box shadow-red-500/50',
    secured: 'border-green-500 text-green-400 neon-box shadow-green-500/50',
    target: 'border-white text-white animate-ping',
    immune: 'border-purple-500 text-purple-400 cursor-not-allowed',
};

const NodeComponent: React.FC<{ node: Node, onClick: (id: string) => void }> = ({ node, onClick }) => (
    <div
        className={`absolute transform -translate-x-1/2 -translate-y-1/2 p-3 bg-gray-900/80 border-2 rounded-full flex flex-col items-center justify-center transition-all duration-300 w-28 h-28 ${statusClasses[node.status]}`}
        style={{ top: node.position.top, left: node.position.left }}
        onClick={() => onClick(node.id)}
    >
        <NodeIcon type={node.type} />
        <span className="text-xs mt-1 text-center font-bold">{node.name}</span>
    </div>
);

const ConnectionLine: React.FC<{ from: Node, to: Node }> = ({ from, to }) => {
    const fromPos = { x: parseFloat(from.position.left), y: parseFloat(from.position.top) };
    const toPos = { x: parseFloat(to.position.left), y: parseFloat(to.position.top) };

    const angle = Math.atan2(toPos.y - fromPos.y, toPos.x - fromPos.x) * 180 / Math.PI;
    const length = Math.sqrt(Math.pow(toPos.x - fromPos.x, 2) + Math.pow(toPos.y - fromPos.y, 2));

    return (
        <div
            className="absolute bg-cyan-500/20 h-0.5"
            style={{
                left: `${fromPos.x}%`,
                top: `${fromPos.y}%`,
                width: `${length}%`,
                transform: `rotate(${angle}deg)`,
                transformOrigin: '0 0',
            }}
        />
    );
};


export const NetworkMap: React.FC<NetworkMapProps> = ({ nodes, onNodeClick, isLoading, activeTool }) => {
    const nodeMap = new Map(nodes.map(n => [n.id, n]));
    
    return (
        <div className="h-full bg-black/50 p-4 relative overflow-hidden">
            <h2 className="text-2xl font-orbitron text-cyan-400 border-b-2 border-cyan-500/30 pb-2 mb-4 text-glow">Network Topology</h2>
            <div className="relative w-full h-[calc(100%-4rem)]">
                {nodes.map(node => (
                    node.connections.map(connId => {
                        const targetNode = nodeMap.get(connId);
                        if(targetNode) {
                           return <ConnectionLine key={`${node.id}-${connId}`} from={node} to={targetNode} />
                        }
                        return null;
                    })
                ))}
                {nodes.map(node => (
                    <NodeComponent key={node.id} node={node} onClick={() => onNodeClick(node.id)} />
                ))}
            </div>
             {isLoading && (
                <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center z-20">
                    <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-cyan-400"></div>
                    <p className="text-cyan-300 mt-4 font-orbitron text-lg">PROCESSING...</p>
                </div>
            )}
        </div>
    );
};