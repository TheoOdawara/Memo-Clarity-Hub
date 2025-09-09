import React, { useState, useEffect } from 'react';

// Simple Memory Game: Match pairs of cards
const CARD_PAIRS = [
  '🍎', '🍎', '🍌', '🍌', '🍇', '🍇', '🍉', '🍉',
  '🍒', '🍒', '🍍', '🍍', '🥝', '🥝', '🍑', '🍑'
];

function shuffle(array: string[]): string[] {
  return array
    .map((item) => ({ item, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ item }) => item);
}

export interface MemoryGameProps {
  onComplete: (score: number) => void;
  level?: string;
}

const getCardsForLevel = (level?: string) => {
  if (level === 'easy') return shuffle(CARD_PAIRS.slice(0, 8));
  if (level === 'hard') return shuffle(CARD_PAIRS);
  return shuffle(CARD_PAIRS.slice(0, 12)); // medium
};

const MemoryGame: React.FC<MemoryGameProps> = ({ onComplete, level = 'medium' }) => {
  const [cards, setCards] = useState<string[]>(getCardsForLevel(level));
  const [flipped, setFlipped] = useState<number[]>([]);
  const [matched, setMatched] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    if (matched.length === cards.length && cards.length > 0) {
      setFinished(true);
      // Score: 100 - moves penalty
      const score = Math.max(40, 100 - moves * 3);
      setTimeout(() => onComplete(score), 1200);
    }
  }, [matched, cards, moves, onComplete]);

  function handleFlip(idx: number) {
    if (flipped.length === 2 || flipped.includes(idx) || matched.includes(idx)) return;
    setFlipped([...flipped, idx]);
    if (flipped.length === 1) {
      setMoves(moves + 1);
      const firstIdx = flipped[0];
      if (cards[firstIdx] === cards[idx]) {
        setTimeout(() => {
          setMatched([...matched, firstIdx, idx]);
          setFlipped([]);
        }, 600);
      } else {
        setTimeout(() => setFlipped([]), 900);
      }
    }
  }

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-2xl border shadow">
      <h2 className="text-lg font-semibold mb-2">Phase 4 — Memory</h2>
      <p className="text-sm text-gray-600 mb-4">Find all matching pairs. Fewer moves = higher score.</p>
      <div className="grid grid-cols-4 gap-3 mb-4">
        {cards.map((card, idx) => (
          <button
            key={idx}
            className={`h-16 w-16 flex items-center justify-center text-2xl rounded-lg border transition-all duration-200 bg-gray-50 ${flipped.includes(idx) || matched.includes(idx) ? 'bg-yellow-100' : ''}`}
            onClick={() => handleFlip(idx)}
            disabled={flipped.length === 2 || matched.includes(idx) || finished}
          >
            {(flipped.includes(idx) || matched.includes(idx)) ? card : '❓'}
          </button>
        ))}
      </div>
      <div className="text-sm text-gray-700 mb-2">Moves: {moves}</div>
      {finished && <div className="text-green-600 font-bold">Completed! Score: {Math.max(40, 100 - moves * 3)}</div>}
    </div>
  );
};

export default MemoryGame;
