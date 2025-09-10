import { useEffect, useState, useRef } from 'react';

interface SequenceGameProps {
  onEnd: (score: number) => void;
}

const COLORS = [
  { id: 0, name: 'Green', class: 'bg-green-500', active: 'bg-green-300' },
  { id: 1, name: 'Red', class: 'bg-red-500', active: 'bg-red-300' },
  { id: 2, name: 'Yellow', class: 'bg-yellow-400', active: 'bg-yellow-300' },
  { id: 3, name: 'Blue', class: 'bg-blue-500', active: 'bg-blue-300' },
];

const MAX_PHASES = 5;

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export default function SequenceGame({ onEnd }: SequenceGameProps) {
  const [phase, setPhase] = useState(1);
  // sequence is stored in sequenceRef to avoid stale-state races
  const [showing, setShowing] = useState(false);
  const [active, setActive] = useState<number | null>(null);
  const [playerIdx, setPlayerIdx] = useState(0);
  const [error, setError] = useState(false);
  const [completed, setCompleted] = useState(false);
  const sequenceRef = useRef<number[]>([]);

  // Start the first phase on mount (extend from empty sequence)
  useEffect(() => {
    // build first phase
    startPhase(1, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Helper to get a random color id
  function randColor() {
    return Math.floor(Math.random() * COLORS.length);
  }

  // Start a phase. If `extend` is true we'll add one new random color to the existing sequence;
  // otherwise we'll ensure sequence length is targetPhase (used rarely).
  async function startPhase(targetPhase: number, extend: boolean) {
    setShowing(true);
    setError(false);
    setPlayerIdx(0);
    setPhase(targetPhase);

    // Build the next sequence deterministically and keep it in a ref to avoid stale-state races
    let nextSeq = sequenceRef.current.slice(0, targetPhase);
    if (extend) {
      nextSeq = [...sequenceRef.current, randColor()];
    }
    while (nextSeq.length < targetPhase) nextSeq.push(randColor());

  sequenceRef.current = nextSeq;

    // Small delay before showing
    await sleep(350);

    // Show the sequence using the ref (no races)
    for (let i = 0; i < nextSeq.length; i++) {
      setActive(nextSeq[i]);
      await sleep(600);
      setActive(null);
      await sleep(200);
    }

    setShowing(false);
  }

  // Called when user clicks a quadrant
  async function handleClick(id: number) {
    if (showing || completed) return;

    // Defensive: ensure sequence is ready
    const seq = sequenceRef.current;
    if (seq.length < phase) return;

    // check against ref to avoid stale state
    if (id !== seq[playerIdx]) {
      // mistake: end the game and advance to next. Score = phases completed (phase - 1)
      setError(true);
      // small delay so user sees feedback
      await sleep(500);
      onEnd(Math.max(0, phase - 1));
      return;
    }

    // correct
    const nextIdx = playerIdx + 1;
    setPlayerIdx(nextIdx);

    // if completed this phase
    if (nextIdx === phase) {
      // if last phase, complete the game
      if (phase >= MAX_PHASES) {
        setCompleted(true);
        setTimeout(() => onEnd(MAX_PHASES), 300);
        return;
      }

      // proceed to next phase: extend sequence by one and show it
      await sleep(300);
      startPhase(phase + 1, true);
    }
  }

  // Restart helper
  function handleRestart() {
  sequenceRef.current = [];
    setPhase(1);
    setPlayerIdx(0);
    setError(false);
    setCompleted(false);
  // reset any transient refs
    startPhase(1, true);
  }

  return (
    <div className="max-w-md mx-auto text-center">
      <p className="mb-3 text-gray-600">Phase {phase} of {MAX_PHASES}</p>

      <div className="w-80 h-80 mx-auto grid grid-cols-2 gap-4">
        {COLORS.map(c => {
          const baseBg = active === c.id ? c.active : c.class;
          const extra = active === c.id ? 'ring-8 ring-white/30 scale-105 shadow-2xl' : 'hover:scale-102';
          return (
            <button
              key={c.id}
              onClick={() => handleClick(c.id)}
              className={`w-full h-full rounded-lg shadow-md focus:outline-none transform transition-all relative overflow-hidden ${baseBg} ${extra}`}
              aria-label={c.name}
              disabled={showing || completed}
            >
              {/* subtle bright overlay when active for clearer visibility */}
              <span
                className={`absolute inset-0 pointer-events-none transition-opacity duration-150 ${active === c.id ? 'bg-white/30 opacity-100' : 'opacity-0'}`}
              />
            </button>
          );
        })}
      </div>

      <div className="mt-6">
        {showing && <div className="text-sm text-gray-500">Observe the sequence...</div>}
        {error && <div className="text-sm text-red-600 font-semibold">Wrong — the sequence will be repeated</div>}
        {completed && <div className="text-sm text-green-600 font-semibold">Well done — game complete!</div>}
      </div>

      <div className="mt-4 flex justify-center gap-3">
        <button onClick={handleRestart} className="px-4 py-2 bg-blue-600 text-white rounded">Restart</button>
      </div>
    </div>
  );
}
