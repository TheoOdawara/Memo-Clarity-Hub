import React, { useState } from 'react';
import { Awards } from '../../components/award';
import AssociationGame from '../../components/AssociationGame/AssociationGame';
import ReactionGame from '../../components/ReactionGame/ReactionGame';
import SequenceGame from '../../components/SequenceGame/SequenceGame';
import MemoryGame from '../../components/MemoryGame/MemoryGame';
import { testService } from '../../services/test';
import toast from 'react-hot-toast';

const games = [
  { name: 'Association', component: AssociationGame },
  { name: 'Reaction', component: ReactionGame },
  { name: 'Sequence', component: SequenceGame },
  { name: 'Memory', component: MemoryGame },
];

const MediumLevelTest: React.FC = () => {
  const [currentGame, setCurrentGame] = useState(0);
  const [results, setResults] = useState<number[]>([]);

  // Normalização customizada para cada jogo
  // AssociationGame: score = tempo em segundos (quanto menor, melhor)
  // ReactionGame: score = { correct, total } (acertos/erros)
  // SequenceGame: score = fase alcançada (quanto maior, melhor)
  // MemoryGame: score = movimentos (quanto menor, melhor)

  // Score types for each game
  type AssociationScore = number; // time in seconds
  type ReactionScore = { correct: number; total: number };
  type SequenceScore = number; // level reached
  type MemoryScore = number; // moves

  type GameScore = AssociationScore | ReactionScore | SequenceScore | MemoryScore;

  function normalizeScore(gameIdx: number, score: GameScore): number {
    if (gameIdx === 0) {
      // AssociationGame: tempo em segundos
      const minTime = 10;
      const maxTime = 60;
      const time = typeof score === 'number' ? score : maxTime;
      const normalized = Math.max(0, Math.min(1, (maxTime - time) / (maxTime - minTime)));
      return Math.round(normalized * 25);
    }
    if (gameIdx === 1) {
      // ReactionGame: score = { correct, total }
      if (typeof score === 'object' && score !== null && 'correct' in score && 'total' in score && typeof score.correct === 'number' && typeof score.total === 'number' && score.total > 0) {
        const ratio = score.correct / score.total;
        return Math.round(ratio * 25);
      }
      return 0;
    }
    if (gameIdx === 2) {
      // SequenceGame: fase
      const maxLevel = 10;
      const level = typeof score === 'number' ? score : 0;
      const normalized = Math.max(0, Math.min(1, level / maxLevel));
      return Math.round(normalized * 25);
    }
    if (gameIdx === 3) {
      // MemoryGame: movimentos
      const minMoves = 6;
      const maxMoves = 30;
      const moves = typeof score === 'number' ? score : maxMoves;
      const normalized = Math.max(0, Math.min(1, (maxMoves - moves) / (maxMoves - minMoves)));
      return Math.round(normalized * 25);
    }
    return 0;
  }

  const handleGameEnd = async (score: number) => {
    const normalized = normalizeScore(currentGame, score);
    const newResults = [...results, normalized];
    setResults(newResults);
    
    // Se terminou o MemoryGame (último), salva no banco e mostra resultado
    if (currentGame === games.length - 1) {
      const totalScore = newResults.reduce((a, b) => a + b, 0);
      
      try {
        await testService.saveTestResult({
          phase_scores: [newResults[0] || 0, newResults[1] || 0, newResults[2] || 0, newResults[3] || 0],
          total_score: totalScore
        });
        toast.success('Test result saved successfully!');
      } catch (error) {
        console.error('Error saving test result:', error);
        toast.error('Failed to save test result');
      }
      
      setCurrentGame(currentGame + 1); // Avança para mostrar resultado
    } else {
      setCurrentGame(currentGame + 1);
    }
  };

  if (currentGame >= games.length) {
    const totalScore = results.reduce((a, b) => a + b, 0);
    const dateStr = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    let level: "bronze" | "silver" | "gold" | "platinum" | undefined;
    if (totalScore >= 90) level = "platinum";
    else if (totalScore >= 75) level = "gold";
    else if (totalScore >= 50) level = "silver";
    else if (totalScore > 0) level = "bronze";
    else level = undefined;
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] w-full px-2 py-12">
        <div className="max-w-2xl w-full flex flex-col items-center justify-center">
          <Awards
            variant="award"
            title="Cognitive Test Result"
            subtitle={`Score: ${totalScore} / 100`}
            date={dateStr}
            level={level}
            description={undefined}
            recipient={undefined}
            className="pt-20 pb-16"
          />
          <div className="mt-10 text-2xl text-gray-700 font-nunito text-center max-w-xl">
            {totalScore >= 90 && 'Outstanding! You achieved an excellent result.'}
            {totalScore >= 75 && totalScore < 90 && 'Excellent! You performed very well.'}
            {totalScore >= 60 && totalScore < 75 && 'Good job! There is room to improve.'}
            {totalScore < 60 && 'Keep practicing to improve your score.'}
          </div>
          <button
            className="mt-12 px-6 py-3 bg-primary text-white rounded-lg shadow hover:bg-primary/80 transition-all text-lg font-bold"
            onClick={() => window.location.href = "/games"}
          >
            Go back to test page
          </button>
        </div>
        <style>{`
          .award-laurel-wreath {
            margin-top: 32px;
            margin-bottom: 32px;
            transform: scale(1.15);
          }
          .award-laurel-wreath path {
            /* Increase spacing between leaves and text */
            transform: translateY(-16px);
          }
        `}</style>
      </div>
    );
  }

  const GameComponent = games[currentGame].component;
  const displayNames = ['Association', 'Reaction', 'Sequence', 'Memory'];
  const pageTitle = `${displayNames[currentGame] || 'Game'} Game`;
  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-8">
        <button
          className="px-5 py-2 bg-red-600 text-white rounded-lg shadow hover:bg-red-700 font-bold text-base"
          onClick={() => window.location.href = "/games"}
        >
          Cancel Test
        </button>
        <h1 className="text-5xl font-poppins font-bold text-center flex-1">
          <span className="bg-gradient-to-r from-[#0B4F6C] via-[#0B78A6] to-[#7FD3FF] bg-clip-text text-transparent drop-shadow-xl">{pageTitle}</span>
        </h1>
        <div style={{ width: 120 }} />
      </div>
      <GameComponent onEnd={handleGameEnd} />
    </div>
  );
};

export default MediumLevelTest;
