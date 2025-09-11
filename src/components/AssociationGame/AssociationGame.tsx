

import React, { useState } from 'react';

interface AssociationGameProps {
  onEnd: (score: number) => void;
}

// Banco variado de missões
const ALL_MISSIONS = [
  {
    title: 'Mark all ANIMALS',
    items: [
      { icon: '🐶', isCorrect: true }, { icon: '🦁', isCorrect: true }, { icon: '🐱', isCorrect: true }, { icon: '🐦', isCorrect: true },
      { icon: '🍎', isCorrect: false }, { icon: '🔧', isCorrect: false }, { icon: '🌳', isCorrect: false }, { icon: '🛡️', isCorrect: false },
      { icon: '🍔', isCorrect: false }, { icon: '💡', isCorrect: false }, { icon: '🦉', isCorrect: true }, { icon: '🐸', isCorrect: true },
    ],
  },
  {
    title: 'Find and tap every food item',
    items: [
      { icon: '🍎', isCorrect: true }, { icon: '🍔', isCorrect: true }, { icon: '🍌', isCorrect: true }, { icon: '🍇', isCorrect: true },
      { icon: '🌳', isCorrect: false }, { icon: '🐶', isCorrect: false }, { icon: '🦁', isCorrect: false }, { icon: '🐱', isCorrect: false },
      { icon: '🐦', isCorrect: false }, { icon: '🔧', isCorrect: false }, { icon: '🛡️', isCorrect: false }, { icon: '💡', isCorrect: false },
    ],
  },
  {
    title: 'Mark all TOOLS',
    items: [
      { icon: '🔧', isCorrect: true }, { icon: '🛡️', isCorrect: true }, { icon: '🧰', isCorrect: true }, { icon: '🔨', isCorrect: true },
      { icon: '💡', isCorrect: false }, { icon: '🍎', isCorrect: false }, { icon: '🍔', isCorrect: false }, { icon: '🍌', isCorrect: false },
      { icon: '🌳', isCorrect: false }, { icon: '🐶', isCorrect: false }, { icon: '🦁', isCorrect: false }, { icon: '🐱', isCorrect: false },
    ],
  },
  {
    title: 'Mark all COLORS',
    items: [
      { icon: '🟦', isCorrect: true }, { icon: '🟥', isCorrect: true }, { icon: '🟩', isCorrect: true }, { icon: '🟨', isCorrect: true },
      { icon: '🍎', isCorrect: false }, { icon: '🔧', isCorrect: false }, { icon: '🌳', isCorrect: false }, { icon: '🛡️', isCorrect: false },
      { icon: '🍔', isCorrect: false }, { icon: '💡', isCorrect: false }, { icon: '🦉', isCorrect: false }, { icon: '🐸', isCorrect: false },
    ],
  },
  {
    title: 'Mark all VEHICLES',
    items: [
      { icon: '🚗', isCorrect: true }, { icon: '🚕', isCorrect: true }, { icon: '✈️', isCorrect: true }, { icon: '🚲', isCorrect: true },
      { icon: '🍎', isCorrect: false }, { icon: '🔧', isCorrect: false }, { icon: '🌳', isCorrect: false }, { icon: '🛡️', isCorrect: false },
      { icon: '🍔', isCorrect: false }, { icon: '💡', isCorrect: false }, { icon: '🦉', isCorrect: false }, { icon: '🐸', isCorrect: false },
    ],
  },
  {
    title: 'Mark all OBJECTS',
    items: [
      { icon: '🧰', isCorrect: true }, { icon: '🔨', isCorrect: true }, { icon: '💡', isCorrect: true }, { icon: '🛡️', isCorrect: true },
      { icon: '🍎', isCorrect: false }, { icon: '🍔', isCorrect: false }, { icon: '🍌', isCorrect: false }, { icon: '🌳', isCorrect: false },
      { icon: '🐶', isCorrect: false }, { icon: '🦁', isCorrect: false }, { icon: '🐱', isCorrect: false }, { icon: '🐦', isCorrect: false },
    ],
  },
];

function getDailyMissions(): Array<{ title: string; items: Array<{ icon: string; isCorrect: boolean }> }> {
  // Use a seed based on the date to shuffle and pick missions
  const today = new Date().toISOString().slice(0, 10);
  let seed = 0;
  for (let i = 0; i < today.length; i++) seed += today.charCodeAt(i);
  function seededShuffle<T>(arr: T[]): T[] {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      seed = (seed * 9301 + 49297) % 233280;
      const j = Math.floor((seed / 233280) * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }
  // Embaralha os itens de cada missão para aleatoriedade visual
  function shuffle<T>(arr: T[]): T[] {
    return arr.map(value => ({ value, sort: Math.random() })).sort((a, b) => a.sort - b.sort).map(({ value }) => value);
  }
  return seededShuffle(ALL_MISSIONS).slice(0, 3).map(mission => ({
    ...mission,
    items: shuffle(mission.items)
  }));
}

const AssociationGame: React.FC<AssociationGameProps> = ({ onEnd }) => {
  const [missions] = useState(getDailyMissions());
  const [missionIdx, setMissionIdx] = useState(0);
  const items = React.useMemo(() => missions[missionIdx]?.items || [], [missions, missionIdx]);
  const [marked, setMarked] = useState<boolean[]>(Array(items.length).fill(false));
  const [finished, setFinished] = useState(false);
  const [success, setSuccess] = useState(false);

  // Update grid when mission changes
  React.useEffect(() => {
    setMarked(Array(items.length).fill(false));
    setFinished(false);
    setSuccess(false);
  }, [missionIdx, missions, items.length]);

  // Verifica se todos os corretos foram marcados
  React.useEffect(() => {
    if (!items.length) return;
    const correctIndexes = items.map((item, idx) => item.isCorrect ? idx : -1).filter(idx => idx !== -1);
    const allMarked = correctIndexes.every(idx => marked[idx]);
    if (allMarked && !finished) {
      setFinished(true);
      setSuccess(true);
      setTimeout(() => {
        if (missionIdx < missions.length - 1) {
          setMissionIdx(missionIdx + 1);
        } else {
          onEnd(missions.length);
        }
      }, 1200);
    }
  }, [marked, finished, missionIdx, missions, onEnd, items]);

  const handleMark = (idx: number) => {
    if (finished || marked[idx]) return;
    setMarked(prev => {
      const arr = [...prev];
      arr[idx] = true;
      return arr;
    });
  };

  return (
    <div className="p-4 min-h-screen flex flex-col items-center justify-center bg-soft-white">
  {/* Título removido conforme solicitado */}
      <div className="max-w-xl w-full mx-auto bg-soft-white rounded-3xl shadow-2xl flex flex-col gap-8 border-4 border-teal-800 p-6 animate-pop-in">
  <h3 className="mb-2 text-xl font-poppins font-semibold text-[#0B4F6C] text-center animate-fade-in">{missions[missionIdx].title}</h3>
        <div className="grid grid-cols-3 gap-8 mt-4">
          {items.map((item, idx) => (
            <button
              key={idx}
              className={`relative w-20 h-20 flex items-center justify-center text-4xl rounded-2xl font-bold border-4 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-teal-400 shadow-lg
                ${marked[idx]
                  ? item.isCorrect
                    ? "bg-green-200 border-green-600 text-green-700 animate-correct"
                    : "bg-coral-500 border-coral-700 text-white animate-wrong"
                  : "bg-soft-white border-gray-300 text-teal-800 hover:bg-aqua-200 hover:border-amber-400 hover:scale-105"}
              `}
              onClick={() => handleMark(idx)}
              aria-label={`Mark ${item.icon}`}
              disabled={marked[idx] || finished}
              style={{ transition: 'transform 0.15s' }}
            >
              <span className="transition-transform duration-200">{item.icon}</span>
              {marked[idx] && item.isCorrect && (
                <span className="absolute top-2 right-2 text-green-600 text-2xl font-bold animate-bounce">✔️</span>
              )}
            </button>
          ))}
        </div>
        {success && (
          <div className="mt-8 text-center animate-pop">
            <span className="text-2xl font-bold text-amber-400 font-poppins animate-bounce">Great job!</span>
            <div className="mt-2">
              <span className="text-lg font-semibold text-teal-800 font-nunito animate-fade-in">All correct items marked!</span>
            </div>
          </div>
        )}
      </div>
      <style>{`
        .animate-fade-in { animation: fadeIn 0.7s; }
        .animate-pop-in { animation: popIn 0.5s; }
        .animate-correct { animation: correctAnim 0.5s; }
        .animate-wrong { animation: wrongAnim 0.5s; }
        .animate-bounce { animation: bounce 0.7s; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes popIn { 0% { transform: scale(0.8); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }
        @keyframes correctAnim { 0% { background: #A7D9D3; } 100% { background: #C6F6D5; } }
        @keyframes wrongAnim { 0% { background: #FF6F61; } 100% { background: #FCA311; } }
        @keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
      `}</style>
    </div>
  );
};

export default AssociationGame;
