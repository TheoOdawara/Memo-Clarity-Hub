import React, { useState } from 'react';
import AssociationGame from '../../components/AssociationGame/AssociationGame';
import ReactionGame from '../../components/ReactionGame/ReactionGame';
import SequenceGame from '../../components/SequenceGame/SequenceGame';
import MemoryGame from '../../components/MemoryGame/MemoryGame';

const games = [
  { name: 'Associação', component: AssociationGame },
  { name: 'Reação', component: ReactionGame },
  { name: 'Sequência', component: SequenceGame },
  { name: 'Memória', component: MemoryGame },
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
  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-4">Etapa: {games[currentGame].name}</h2>
      <GameComponent onEnd={handleGameEnd} />
    </div>
  );
};

export default MediumLevelTest;
