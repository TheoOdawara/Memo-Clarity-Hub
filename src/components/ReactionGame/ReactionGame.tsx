import React, { useState, useEffect } from 'react';

interface ReactionGameProps {
  onEnd: (score: number) => void;
}

const ReactionGame: React.FC<ReactionGameProps> = ({ onEnd }) => {
  const [waiting, setWaiting] = useState(true);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [score, setScore] = useState<number | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setWaiting(false);
      setStartTime(Date.now());
    }, Math.random() * 2000 + 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleClick = () => {
    if (!waiting && startTime) {
      const reaction = Date.now() - startTime;
      setScore(reaction);
      setTimeout(() => onEnd(1000 - Math.min(reaction, 1000)), 500);
    }
  };

  return (
    <div className="text-center">
      {waiting ? (
        <div>Aguarde o sinal...</div>
      ) : score === null ? (
        <button className="px-4 py-2 bg-blue-500 text-white rounded" onClick={handleClick}>
          Clique agora!
        </button>
      ) : (
        <div>Seu tempo de reação: {score} ms</div>
      )}
    </div>
  );
};

export default ReactionGame;
