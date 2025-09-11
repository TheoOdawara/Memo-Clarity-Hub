import React, { useState } from 'react';

interface SequenceGameProps {
  onEnd: (score: number) => void;
}

const sequence = ['A', 'B', 'C', 'D'];

const SequenceGame: React.FC<SequenceGameProps> = ({ onEnd }) => {
  const [input, setInput] = useState('');
  const [finished, setFinished] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value.toUpperCase());
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFinished(true);
    setTimeout(() => onEnd(input === sequence.join('') ? 1 : 0), 500);
  };

  return (
    <form onSubmit={handleSubmit} className="text-center">
      <div className="mb-2">Enter the correct sequence: <span className="font-mono">A B C D</span></div>
      <input
        type="text"
        value={input}
        onChange={handleChange}
        className="border px-2 py-1 mr-2"
        disabled={finished}
        maxLength={4}
      />
      <button type="submit" className="px-3 py-1 bg-green-500 text-white rounded" disabled={finished}>
        Submit
      </button>
      {finished && (
        <div className="mt-2">{input === sequence.join('') ? 'Correct!' : 'Incorrect.'}</div>
      )}
    </form>
  );
};

export default SequenceGame;
