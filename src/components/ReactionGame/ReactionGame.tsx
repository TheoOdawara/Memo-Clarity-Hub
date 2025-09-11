import React, { useState, useEffect, useRef } from 'react';

interface ReactionGameProps {
  onEnd: (score: number) => void;
}

type Target = {
  id: number;
  left: number; // percent
  top: number; // percent
  isDistractor?: boolean;
};

const TARGET_COUNT = 18; // total targets to show
const TARGET_LIFETIME = 900; // ms
const DISTRACTOR_CHANCE = 0.18;

const ReactionGame: React.FC<ReactionGameProps> = ({ onEnd }) => {
  const [started, setStarted] = useState(false);
  const [spawnedCount, setSpawnedCount] = useState(0);
  const [activeTarget, setActiveTarget] = useState<Target | null>(null);
  const [hits, setHits] = useState(0);
  const [misses, setMisses] = useState(0);
  const [reactionTimes, setReactionTimes] = useState<number[]>([]);
  const timerRef = useRef<number | null>(null);
  const shownAtRef = useRef<number | null>(null);

  // Don't auto-start - wait for user to click Start
  useEffect(() => {
    return () => clearExistingTimer();
  }, []);

  useEffect(() => {
    // end condition: all targets were shown and none active
    if (started && spawnedCount >= TARGET_COUNT && activeTarget === null) {
      const avg = reactionTimes.length ? reactionTimes.reduce((a, b) => a + b, 0) / reactionTimes.length : 0;
      const score = Math.max(0, Math.round(hits * 1000 - avg - misses * 250));
      setTimeout(() => onEnd(score), 600);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [spawnedCount, activeTarget, started]);

  function clearExistingTimer() {
    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }

  function randomPosition(): { left: number; top: number } {
    // keep away from edges
    const padding = 8; // percent
    const left = Math.floor(Math.random() * (100 - padding * 2)) + padding;
    const top = Math.floor(Math.random() * (80 - padding * 2)) + padding; // avoid covering header area
    return { left, top };
  }

  function spawnTarget() {
    if (!started || spawnedCount >= TARGET_COUNT) return setActiveTarget(null);
    const isDistractor = Math.random() < DISTRACTOR_CHANCE;
    const pos = randomPosition();
    const nextId = spawnedCount + 1; // numbered target id
    const target: Target = isDistractor
      ? { id: -1, left: pos.left, top: pos.top, isDistractor: true }
      : { id: nextId, left: pos.left, top: pos.top };
    setActiveTarget(target);
    shownAtRef.current = Date.now();
    setSpawnedCount(nextId);

    // remove after lifetime
    clearExistingTimer();
    timerRef.current = window.setTimeout(() => {
      // if user didn't click
      if (target.isDistractor) {
        setActiveTarget(null);
        timerRef.current = window.setTimeout(() => startNext(), 300);
      } else {
        setMisses(m => m + 1);
        setActiveTarget(null);
        timerRef.current = window.setTimeout(() => startNext(), 300);
      }
    }, TARGET_LIFETIME);
  }

  function startNext() {
    if (!started) return;
    // small randomized delay before target appears (faster)
    clearExistingTimer();
    timerRef.current = window.setTimeout(() => {
      spawnTarget();
    }, Math.random() * 500 + 150);
  }

  function handleStart() {
    if (started) return;
    setStarted(true);
    setSpawnedCount(0);
    setActiveTarget(null);
    setHits(0);
    setMisses(0);
    setReactionTimes([]);
    startNext();
  }

  function handleTargetClick(t: Target) {
    if (!started) return;
    const now = Date.now();
    if (!t) return;
    // if distractor clicked -> penalty
    if (t.isDistractor) {
      setMisses(m => m + 1);
      setActiveTarget(null);
      clearExistingTimer();
      // next
      timerRef.current = window.setTimeout(() => startNext(), 400);
      return;
    }
    // correct target
    const shownAt = shownAtRef.current || now;
    const reaction = now - shownAt;
    setReactionTimes(prev => [...prev, reaction]);
    setHits(h => h + 1);
  setActiveTarget(null);
  clearExistingTimer();
  // short pause then next (faster)
  timerRef.current = window.setTimeout(() => startNext(), 150);
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4 px-2">
        <div className="text-left">
          <p className="text-lg font-poppins font-semibold text-[#0B4F6C]">Click the numbered targets as they appear — avoid the red ✖ targets.</p>
          {started && <p className="text-sm text-gray-600 mt-1">Targets left: {Math.max(0, TARGET_COUNT - spawnedCount)} • Hits: {hits} • Misses: {misses}</p>}
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleStart}
            disabled={started}
            className={`min-w-[120px] px-6 py-3 rounded-xl text-lg font-poppins font-semibold shadow-lg transition transform ${started ? 'bg-gray-200 text-gray-700' : 'bg-[#0B4F6C] text-white hover:scale-105'}`}
            aria-pressed={started}
          >
            {started ? 'Running' : 'Start'}
          </button>
        </div>
      </div>

      <div className="relative bg-soft-white rounded-xl border-2 border-teal-100 h-80 overflow-hidden shadow-inner">
        {/* Targets area */}
        {activeTarget && (
          <button
            onClick={() => handleTargetClick(activeTarget)}
            aria-label={activeTarget.isDistractor ? 'Distractor target' : `Target ${activeTarget.id}`}
            className={`absolute transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold shadow-2xl focus:outline-none focus:ring-4`}
            style={{
              left: `${activeTarget.left}%`,
              top: `${activeTarget.top}%`,
              background: activeTarget.isDistractor ? 'linear-gradient(180deg,#FF6F61,#F24935)' : 'linear-gradient(180deg,#A7D9D3,#7FD3C9)',
              border: activeTarget.isDistractor ? '4px solid #C0443A' : '4px solid #0B4F6C',
              color: activeTarget.isDistractor ? '#fff' : '#0B4F6C',
            }}
          >
            <span className="select-none">{activeTarget.isDistractor ? '✖' : activeTarget.id}</span>
          </button>
        )}

        {/* progress bar */}
        <div className="absolute left-4 right-4 bottom-4 h-3 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-teal-600 to-teal-300"
            style={{ width: `${Math.min(100, (spawnedCount / TARGET_COUNT) * 100)}%` }}
          />
        </div>
      </div>

      <div className="mt-6 flex justify-center gap-4">
        <button
          className="px-4 py-2 bg-teal-700 text-white rounded-lg shadow hover:bg-teal-800"
          onClick={() => {
            // restart
            clearExistingTimer();
            setStarted(false);
            setSpawnedCount(0);
            setActiveTarget(null);
            setHits(0);
            setMisses(0);
            setReactionTimes([]);
          }}
        >
          Restart
        </button>

        {started && (
          <div className="flex items-center text-sm text-gray-600">
            <span className="mr-2">Avg reaction:</span>
            <span className="font-mono">{reactionTimes.length ? Math.round(reactionTimes.reduce((a,b)=>a+b,0)/reactionTimes.length) + ' ms' : '—'}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReactionGame;
