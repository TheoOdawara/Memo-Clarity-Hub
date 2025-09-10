import React, { useState } from 'react';

interface AssociationGameProps {
  onEnd: (score: number) => void;
}

const pairs = [
  { left: 'Cachorro', right: 'Latido' },
  { left: 'Gato', right: 'Miau' },
  { left: 'Vaca', right: 'Mugido' },
];

const AssociationGame: React.FC<AssociationGameProps> = ({ onEnd }) => {
  const [selected, setSelected] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const handleSelect = (index: number, answer: string) => {
    const correct = pairs[index].right === answer;
    setScore(s => s + (correct ? 1 : 0));
    setSelected([...selected, answer]);
    if (selected.length + 1 === pairs.length) {
      setFinished(true);
      setTimeout(() => onEnd(score + (correct ? 1 : 0)), 500);
    }
  };

  return (
    <div>
      <h3 className="mb-2">Associe cada animal ao seu som:</h3>
      {pairs.map((pair, idx) => (
        <div key={pair.left} className="mb-2">
          <span className="mr-2">{pair.left}</span>
          {['Latido', 'Miau', 'Mugido'].map(opt => (
            <button
              key={opt}
              className={`px-2 py-1 mx-1 border rounded ${selected[idx] ? 'bg-gray-200' : 'bg-white'}`}
              disabled={!!selected[idx] || finished}
              onClick={() => handleSelect(idx, opt)}
            >
              {opt}
            </button>
          ))}
        </div>
      ))}
      {finished && <div className="mt-4">Pontuação: {score}/{pairs.length}</div>}
    </div>
  );
};

export default AssociationGame;
