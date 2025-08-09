
import React from 'react';
import { useGameLogic } from './hooks/useGameLogic';
import { RoleSelection } from './components/RoleSelection';
import { GameUI } from './components/GameUI';
import { Modal } from './components/Modal';
import { InputPrompt } from './components/InputPrompt';

function App() {
  const gameLogic = useGameLogic();

  const renderContent = () => {
    switch (gameLogic.gameState) {
      case 'role-select':
        return <RoleSelection onSelectRole={gameLogic.selectRole} />;
      case 'playing':
      case 'level-complete':
      case 'game-over':
        return <GameUI logic={gameLogic} />;
      default:
        return <div>Loading...</div>;
    }
  };

  return (
    <div className="bg-black text-cyan-300 min-h-screen">
      {renderContent()}
      <Modal 
        isOpen={gameLogic.gameState === 'level-complete'} 
        onClose={gameLogic.advanceToNextLevel}
        title={gameLogic.educationalContent.title}
      >
        <div className='space-y-4'>
            <p className='text-gray-200'>{gameLogic.educationalContent.text}</p>
            <button
                onClick={gameLogic.advanceToNextLevel}
                className="w-full bg-cyan-500 text-black font-bold py-3 px-6 rounded-md hover:bg-cyan-300 transition-colors duration-200 font-orbitron"
            >
                Proceed to Next Scenario
            </button>
        </div>
      </Modal>
      <Modal 
        isOpen={gameLogic.gameState === 'game-over'} 
        onClose={() => window.location.reload()}
        title="Game Over"
      >
        <div className='space-y-4 text-center'>
            <p className='text-green-400 text-xl font-bold'>Congratulations, Agent!</p>
            <p className='text-gray-200'>You have successfully navigated the quantum landscape and completed all available missions.</p>
            <button
                onClick={() => window.location.reload()}
                className="mt-4 bg-cyan-500 text-black font-bold py-3 px-6 rounded-md hover:bg-cyan-300 transition-colors duration-200 font-orbitron"
            >
                Play Again
            </button>
        </div>
      </Modal>
       <Modal
        isOpen={!!gameLogic.inputPrompt}
        onClose={gameLogic.cancelInput}
        title="Input Required"
      >
        <InputPrompt logic={gameLogic} />
      </Modal>
    </div>
  );
}

export default App;
