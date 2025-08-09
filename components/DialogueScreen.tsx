
import React from 'react';

interface DialogueScreenProps {
  dialogue: string;
  educationalContent?: { title: string; text: string };
  isGameOver?: boolean;
  onContinue: () => void;
}

export const DialogueScreen: React.FC<DialogueScreenProps> = ({ dialogue, educationalContent, isGameOver = false, onContinue }) => {
  return (
    <div className="min-h-screen bg-gray-900/80 flex items-center justify-center p-4">
      <div className="bg-gray-900 border-2 border-cyan-400 rounded-lg shadow-lg w-full max-w-3xl text-white neon-box p-8 text-center flex flex-col items-center">
        
        <h2 className="text-3xl font-orbitron mb-6 text-glow">
          {isGameOver ? 'Mission Complete' : 'Objective Cleared'}
        </h2>

        <p className="text-lg text-gray-200 mb-6 font-mono leading-relaxed">{dialogue}</p>

        {educationalContent && (
             <div className="w-full bg-black/30 border border-cyan-700/50 rounded-lg p-4 mb-8 text-left">
                <h3 className="text-xl font-orbitron text-cyan-300 text-glow mb-2">{educationalContent.title}</h3>
                <p className="text-gray-300">{educationalContent.text}</p>
            </div>
        )}
        
        <button
          onClick={onContinue}
          className="w-1/2 bg-cyan-500 text-black font-bold py-3 px-6 rounded-md hover:bg-cyan-300 transition-colors duration-200 font-orbitron"
        >
          {isGameOver ? 'Play Again' : 'Continue'}
        </button>
      </div>
    </div>
  );
};
