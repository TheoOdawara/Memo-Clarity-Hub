import React, { useState } from 'react';

interface MemoryGameProps {
  onEnd: (score: number) => void;
}

const cards = ['🍎', '🍌', '🍇', '🍎', '🍌', '🍇'];

const shuffle = (arr: string[]) => arr.sort(() => Math.random() - 0.5);

const MemoryGame: React.FC<MemoryGameProps> = ({ onEnd }) => {
  const [shuffled, setShuffled] = useState(() => shuffle(cards));
  const [flipped, setFlipped] = useState<number[]>([]);
  const [matched, setMatched] = useState<number[]>([]);
  const [score, setScore] = useState(0);

  const handleFlip = (idx: number) => {
    if (flipped.length === 2 || flipped.includes(idx) || matched.includes(idx)) return;
    setFlipped([...flipped, idx]);
    if (flipped.length === 1) {
      const first = shuffled[flipped[0]];
      const second = shuffled[idx];
      if (first === second) {
        setMatched([...matched, flipped[0], idx]);
        setScore(s => s + 1);
      }
      setTimeout(() => setFlipped([]), 800);
    }
  };

  React.useEffect(() => {
    if (matched.length === cards.length) {
      setTimeout(() => onEnd(score), 500);
    }
  }, [matched, onEnd, score]);

  return (
    <div className="grid grid-cols-3 gap-2">
      {shuffled.map((card, idx) => (
        <button
          key={idx}
          className={`h-16 w-16 border rounded text-2xl ${flipped.includes(idx) || matched.includes(idx) ? 'bg-yellow-100' : 'bg-gray-200'}`}
          onClick={() => handleFlip(idx)}
          disabled={matched.includes(idx)}
        >
          {flipped.includes(idx) || matched.includes(idx) ? card : '?'}
        </button>
      ))}
      <div className="col-span-3 mt-2">Pares encontrados: {score}</div>
    </div>
  );
};

export default MemoryGame;
