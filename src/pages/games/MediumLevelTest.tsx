import React, { useState } from 'react';
import AssociationGame from '../../components/AssociationGame/AssociationGame';
import ReactionGame from '../../components/ReactionGame/ReactionGame';
import SequenceGame from '../../components/SequenceGame/SequenceGame';
import MemoryGame from '../../components/MemoryGame/MemoryGame';

const games = [
  { name: 'Association', component: AssociationGame },
  { name: 'Reaction', component: ReactionGame },
  { name: 'Sequence', component: SequenceGame },
  { name: 'Memory', component: MemoryGame },
];

const MediumLevelTest: React.FC = () => {
  const [currentGame, setCurrentGame] = useState(0);
  const [results, setResults] = useState<number[]>([]);

  const handleGameEnd = (score: number) => {
    setResults([...results, score]);
    if (currentGame < games.length - 1) {
      setCurrentGame(currentGame + 1);
    }
  };

  if (currentGame >= games.length) {
    const totalScore = results.reduce((a, b) => a + b, 0);
    return (
      <div className="p-4 text-center">
        <h2 className="text-xl font-bold mb-2">Teste concluído!</h2>
        <p>Seu resultado final: <span className="font-mono">{totalScore}</span></p>
      </div>
    );
  }

  const GameComponent = games[currentGame].component;
  const displayNames = ['Association', 'Reaction', 'Sequence', 'Memory'];
  const pageTitle = `${displayNames[currentGame] || 'Game'} Game`;
  return (
    <div className="p-4">
      <h1 className="text-5xl font-poppins font-bold mb-8 text-center">
        <span className="bg-gradient-to-r from-[#0B4F6C] via-[#0B78A6] to-[#7FD3FF] bg-clip-text text-transparent drop-shadow-xl">{pageTitle}</span>
      </h1>
      <GameComponent onEnd={handleGameEnd} />
    </div>
  );
};

export default MediumLevelTest;
