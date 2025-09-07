import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Sequence() {
  const navigate = useNavigate();
  const [started, setStarted] = useState(false);
  const [lastScore, setLastScore] = useState<number | null>(null);

  useEffect(() => {
    const raw = localStorage.getItem('score_sequence');
    if (raw) setLastScore(Number(raw));
  }, []);

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Sequence</h1>
        <p className="text-sm text-gray-600">Memorize a sequence of items and repeat it. Difficulty increases gradually.</p>
      </header>

      <div className="mb-4">
        <div className="text-sm text-gray-500">Last score:</div>
        <div className="text-lg font-medium text-gray-900">{lastScore ?? 'No score yet'}</div>
      </div>

      {!started ? (
        <div className="space-y-4">
          <p className="text-gray-600">When you press Start the sequence will begin. For now this is a placeholder page.</p>
          <div className="flex items-center gap-3">
            <button onClick={() => setStarted(true)} className="px-4 py-2 bg-teal-600 text-white rounded-md shadow">Start</button>
            <button onClick={() => navigate('/games')} className="px-3 py-2 bg-gray-100 rounded-md">Back</button>
          </div>
        </div>
      ) : (
        <div className="p-6 bg-gray-50 rounded-md">
          <p className="text-gray-700">Game started — placeholder (implement game logic later).</p>
          <div className="mt-4">
            <button onClick={() => setStarted(false)} className="px-3 py-2 bg-gray-100 rounded-md">Stop</button>
          </div>
        </div>
      )}
    </div>
  );
}
