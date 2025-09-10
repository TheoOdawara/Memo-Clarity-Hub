

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
      { icon: '🍔', isCorrect: false }, { icon: '💡', isCorrect: false }, { icon: '⚡', isCorrect: false }, { icon: '�', isCorrect: false },
      { icon: '🦉', isCorrect: true }, { icon: '�', isCorrect: true }, { icon: '🍌', isCorrect: false }, { icon: '🧠', isCorrect: false },
    ],
  },
  {
    title: 'Mark all FOODS',
    items: [
      { icon: '🍎', isCorrect: true }, { icon: '🍔', isCorrect: true }, { icon: '🍌', isCorrect: true }, { icon: '🍇', isCorrect: true },
      { icon: '🌳', isCorrect: false }, { icon: '🐶', isCorrect: false }, { icon: '🦁', isCorrect: false }, { icon: '🐱', isCorrect: false },
      { icon: '🐦', isCorrect: false }, { icon: '🔧', isCorrect: false }, { icon: '🛡️', isCorrect: false }, { icon: '💡', isCorrect: false },
      { icon: '⚡', isCorrect: false }, { icon: '🎨', isCorrect: false }, { icon: '🦉', isCorrect: false }, { icon: '🐸', isCorrect: false },
    ],
  },
  {
    title: 'Mark all TOOLS',
    items: [
      { icon: '🔧', isCorrect: true }, { icon: '🛡️', isCorrect: true }, { icon: '🧰', isCorrect: true }, { icon: '🔨', isCorrect: true },
      { icon: '💡', isCorrect: false }, { icon: '🍎', isCorrect: false }, { icon: '🍔', isCorrect: false }, { icon: '🍌', isCorrect: false },
      { icon: '🌳', isCorrect: false }, { icon: '🐶', isCorrect: false }, { icon: '🦁', isCorrect: false }, { icon: '�', isCorrect: false },
      { icon: '🐦', isCorrect: false }, { icon: '⚡', isCorrect: false }, { icon: '🎨', isCorrect: false }, { icon: '🦉', isCorrect: false },
    ],
  },
  {
    title: 'Mark all COLORS',
    items: [
      { icon: '🟦', isCorrect: true }, { icon: '🟥', isCorrect: true }, { icon: '🟩', isCorrect: true }, { icon: '🟨', isCorrect: true },
      { icon: '🍎', isCorrect: false }, { icon: '🔧', isCorrect: false }, { icon: '🌳', isCorrect: false }, { icon: '🛡️', isCorrect: false },
      { icon: '🍔', isCorrect: false }, { icon: '💡', isCorrect: false }, { icon: '⚡', isCorrect: false }, { icon: '🎨', isCorrect: false },
      { icon: '🦉', isCorrect: false }, { icon: '🐸', isCorrect: false }, { icon: '🍌', isCorrect: false }, { icon: '🧠', isCorrect: false },
    ],
  },
  {
    title: 'Mark all VEHICLES',
    items: [
      { icon: '🚗', isCorrect: true }, { icon: '🚕', isCorrect: true }, { icon: '✈️', isCorrect: true }, { icon: '🚲', isCorrect: true },
      { icon: '🍎', isCorrect: false }, { icon: '🔧', isCorrect: false }, { icon: '🌳', isCorrect: false }, { icon: '🛡️', isCorrect: false },
      { icon: '🍔', isCorrect: false }, { icon: '💡', isCorrect: false }, { icon: '⚡', isCorrect: false }, { icon: '🎨', isCorrect: false },
      { icon: '🦉', isCorrect: false }, { icon: '🐸', isCorrect: false }, { icon: '🍌', isCorrect: false }, { icon: '�', isCorrect: false },
    ],
  },
  {
    title: 'Mark all OBJECTS',
    items: [
      { icon: '🧰', isCorrect: true }, { icon: '🔨', isCorrect: true }, { icon: '💡', isCorrect: true }, { icon: '🛡️', isCorrect: true },
      { icon: '🍎', isCorrect: false }, { icon: '🍔', isCorrect: false }, { icon: '🍌', isCorrect: false }, { icon: '🌳', isCorrect: false },
      { icon: '�', isCorrect: false }, { icon: '�', isCorrect: false }, { icon: '🐱', isCorrect: false }, { icon: '🐦', isCorrect: false },
      { icon: '⚡', isCorrect: false }, { icon: '🎨', isCorrect: false }, { icon: '🦉', isCorrect: false }, { icon: '�', isCorrect: false },
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
  return seededShuffle(ALL_MISSIONS).slice(0, 3); // 3 missões por dia
}

const AssociationGame: React.FC<AssociationGameProps> = ({ onEnd }) => {
  const [missions] = useState(getDailyMissions());
  const [missionIdx, setMissionIdx] = useState(0);
  const [marked, setMarked] = useState<boolean[]>(Array(missions[0].items.length).fill(false));
  const [finished, setFinished] = useState(false);
  const [success, setSuccess] = useState(false);

  // Atualiza grid ao trocar missão
  React.useEffect(() => {
    setMarked(Array(missions[missionIdx].items.length).fill(false));
    setFinished(false);
    setSuccess(false);
  }, [missionIdx, missions]);

  // Verifica se todos os corretos foram marcados
  React.useEffect(() => {
    const correctIndexes = missions[missionIdx].items.map((item, idx) => item.isCorrect ? idx : -1).filter(idx => idx !== -1);
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
  }, [marked, finished, missionIdx, missions, onEnd]);

  const handleMark = (idx: number) => {
    if (finished || marked[idx]) return;
    setMarked(prev => {
      const arr = [...prev];
      arr[idx] = true;
      return arr;
    });
  };

  return (
    <div className="max-w-xl mx-auto p-4 bg-soft-white rounded-2xl shadow-2xl flex flex-col gap-8 border-4 border-teal-800">
      <h3 className="mb-2 text-2xl font-bold text-teal-800 text-center font-poppins">{missions[missionIdx].title}</h3>
      <div className="grid grid-cols-4 gap-4 mt-4">
        {missions[missionIdx].items.map((item, idx) => (
          <button
            key={idx}
            className={`w-20 h-20 flex items-center justify-center text-3xl rounded-xl font-bold border-4 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-teal-400
              ${marked[idx]
                ? item.isCorrect
                  ? "bg-green-100 border-green-500 text-green-700 animate-correct"
                  : "animate-wrong"
                : "bg-soft-white border-gray-300 text-teal-800 hover:bg-aqua-200 hover:border-amber-400"}
            `}
            onClick={() => handleMark(idx)}
            aria-label={`Mark ${item.icon}`}
            disabled={marked[idx] || finished}
          >
            {item.icon}
            {marked[idx] && item.isCorrect && (
              <span className="absolute top-1 right-1 text-green-600 text-xl font-bold">✔️</span>
            )}
          </button>
        ))}
      </div>
      {success && (
        <div className="mt-6 text-center animate-pop">
          <span className="text-xl font-bold text-green-600 font-poppins">Great job!</span>
          <div className="mt-2">
            <span className="text-lg font-semibold text-teal-800">All correct items marked!</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssociationGame;
