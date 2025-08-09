
import React, { useState, useEffect } from 'react';
import { useGameLogic } from '../hooks/useGameLogic';

interface InputPromptProps {
    logic: ReturnType<typeof useGameLogic>;
}

export const InputPrompt: React.FC<InputPromptProps> = ({ logic }) => {
    const [inputValue, setInputValue] = useState('');
    const inputRef = React.useRef<HTMLInputElement>(null);
    
    useEffect(() => {
        if (logic.inputPrompt) {
            // Focus input when modal opens
            setTimeout(function() {
                if (inputRef.current) {
                    inputRef.current.focus();
                }
            }, 100);
        }
    }, [logic.inputPrompt]);

    if (!logic.inputPrompt) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        logic.submitInput(inputValue);
        setInputValue('');
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <p className="text-gray-300">{logic.inputPrompt.message}</p>
            <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="w-full bg-gray-800 border-2 border-cyan-600 rounded-md p-3 text-white placeholder-gray-500 focus:ring-2 focus:ring-cyan-400 focus:outline-none font-mono"
                placeholder="Enter solution..."
            />
            <button
                type="submit"
                className="w-full bg-cyan-500 text-black font-bold py-3 px-6 rounded-md hover:bg-cyan-300 transition-colors duration-200 font-orbitron"
            >
                Transmit
            </button>
        </form>
    );
};