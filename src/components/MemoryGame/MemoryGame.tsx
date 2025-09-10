import React, { useState, useEffect } from 'react';

interface MemoryGameProps {
  onEnd: (score: number) => void;
}

// 6 pairs (12 cards) for higher difficulty
const cards = ['🍎', '🍌', '🍇', '🍊', '🍓', '🍉', '🍎', '🍌', '🍇', '🍊', '🍓', '🍉'];

const shuffle = (arr: string[]) => arr.sort(() => Math.random() - 0.5);

const MemoryGame: React.FC<MemoryGameProps> = ({ onEnd }) => {
  const [shuffled, setShuffled] = useState(() => shuffle(cards));
  const [flipped, setFlipped] = useState<number[]>([]);
  const [matched, setMatched] = useState<number[]>([]);
  const [score, setScore] = useState(0);
  const [started, setStarted] = useState(false);
  const [moves, setMoves] = useState(0);
  const [locked, setLocked] = useState(false);

  const handleFlip = (idx: number) => {
    if (!started) return;
    if (locked) return;
    if (flipped.includes(idx) || matched.includes(idx)) return;

    // reveal card
    const next = [...flipped, idx];
    setFlipped(next);

    if (next.length === 2) {
      setLocked(true);
      setMoves(m => m + 1);
      const first = shuffled[next[0]];
      const second = shuffled[next[1]];
      if (first === second) {
        // match
        setMatched(m => [...m, next[0], next[1]]);
        setScore(s => s + 1);
        setTimeout(() => {
          setFlipped([]);
          setLocked(false);
        }, 600);
      } else {
        // not a match
        setTimeout(() => {
          setFlipped([]);
          setLocked(false);
        }, 800);
      }
    }
  };

  useEffect(() => {
    if (matched.length === cards.length) {
      // short delay so user sees final match
      setTimeout(() => onEnd(score), 700);
    }
  }, [matched, onEnd, score]);

  function handleStart() {
    setShuffled(shuffle(cards));
    setFlipped([]);
    setMatched([]);
    setScore(0);
    setMoves(0);
    setLocked(false);
    setStarted(true);
  }

  function handleReset() {
    setShuffled(shuffle(cards));
    setFlipped([]);
    setMatched([]);
    setScore(0);
    setMoves(0);
    setLocked(false);
    setStarted(false);
  }

  return (
    <div className="max-w-md mx-auto p-4 bg-soft-white rounded-2xl shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-poppins font-semibold text-[#0B4F6C]">Memory Game</h3>
          <p className="text-sm text-gray-600 font-nunito">Find matching pairs. Large tiles for easy tapping.</p>
        </div>

        <div className="flex items-center gap-2">
          <div className="text-sm text-gray-700">Pairs: <span className="font-mono">{score}/{cards.length / 2}</span></div>
          <div className="text-sm text-gray-700">Moves: <span className="font-mono">{moves}</span></div>
          {!started ? (
            <button onClick={handleStart} className="ml-3 px-4 py-2 bg-[#0B4F6C] text-white rounded-lg font-poppins shadow">Start</button>
          ) : (
            <button onClick={handleReset} className="ml-3 px-3 py-2 bg-gray-200 text-gray-800 rounded-lg">Reset</button>
          )}
        </div>
      </div>

  <div role="grid" aria-label="Memory cards" className="grid grid-cols-3 sm:grid-cols-4 gap-3">
        {shuffled.map((card, idx) => {
          const isFlipped = flipped.includes(idx) || matched.includes(idx);
          return (
            <button
              key={idx}
              role="gridcell"
              aria-pressed={isFlipped}
              aria-label={isFlipped ? `Card ${card}` : 'Hidden card'}
              onClick={() => handleFlip(idx)}
              disabled={!started || locked || matched.includes(idx)}
              className={`relative h-24 sm:h-28 md:h-32 w-full rounded-xl perspective-focus focus:outline-none`}
            >
              <div className={`relative w-full h-full transition-transform duration-300 ease-in-out transform ${isFlipped ? 'rotate-y-180' : ''}`}>
                <div className={`absolute inset-0 backface-hidden flex items-center justify-center text-2xl md:text-3xl rounded-xl ${isFlipped ? 'bg-yellow-100' : 'bg-gray-200'}`}>
                  {isFlipped ? card : '?'}
                </div>
                <div className="absolute inset-0 backface-hidden rotate-y-180 flex items-center justify-center text-2xl md:text-3xl rounded-xl" style={{ display: 'none' }} />
              </div>
            </button>
          );
        })}
      </div>

      <style>{`
        .perspective-focus { perspective: 800px; }
        .backface-hidden { backface-visibility: hidden; -webkit-backface-visibility: hidden; }
        .rotate-y-180 { transform: rotateY(180deg); }
      `}</style>
    </div>
  );
};

export default MemoryGame;
