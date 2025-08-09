

import React from 'react';
import { useGameLogic } from './hooks/useGameLogic';
import { RoleSelection } from './components/RoleSelection';
import { GameUI } from './components/GameUI';
import { Modal } from './components/Modal';
import { DialogueScreen } from './components/DialogueScreen';

function App() {
  const gameLogic = useGameLogic();

  const renderContent = () => {
    switch (gameLogic.gameState) {
      case 'role-select':
        return <RoleSelection onSelectRole={gameLogic.selectRole} />;
      case 'puzzle':
        return <GameUI logic={gameLogic} />;
      case 'dialogue':
        return <DialogueScreen 
                  dialogue={gameLogic.dialogue}
                  educationalContent={gameLogic.educationalContent}
                  onContinue={gameLogic.advanceToNextPuzzle} 
                />;
      case 'game-over':
         return <DialogueScreen 
                  dialogue={gameLogic.dialogue}
                  isGameOver={true}
                  onContinue={gameLogic.resetGame} 
                />;
      default:
        return (
          <div className="min-h-screen flex items-center justify-center">
             <RoleSelection onSelectRole={gameLogic.selectRole} />
          </div>
        );
    }
  };

  return (
    <div className="bg-black text-cyan-300 min-h-screen">
      {renderContent()}
    </div>
  );
}

export default App;