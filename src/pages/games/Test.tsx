import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { testService } from '@/services/test'

// Simple placeholder mini-games for each phase. Each phase returns a numeric score (0..100)
// This file orchestrates the 4-phase flow: Sequence -> Association -> Reaction -> Memory

function PhaseContainer({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-2xl border border-gray-100 shadow-sm">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">{title}</h2>
      <div>{children}</div>
    </div>
  )
}

function SequencePhase({ onComplete, autoPlay, level }: { onComplete: (score: number) => void; autoPlay?: boolean; level?: string }) {
  // placeholder: score is randomized after 'Play'
  const [started, setStarted] = useState(false)
  const [score, setScore] = useState<number | null>(null)

  function play() {
    setStarted(true)
    // simulate running the mini-game and finishing
    setTimeout(() => {
      const base = 60
      const modifier = level === 'easy' ? -10 : level === 'hard' ? 10 : 0
      const range = level === 'hard' ? 50 : level === 'easy' ? 30 : 40
      const s = Math.floor(base + modifier + Math.random() * range)
      setScore(s)
      onComplete(s)
    }, 800)
  }

  useEffect(() => {
    if (autoPlay && !started) play()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoPlay])

  return (
    <PhaseContainer title="Phase 1 — Sequence">
      <p className="text-sm text-gray-600 mb-4">Memorize and repeat the shown sequence. This is a short demo placeholder.</p>
      <div className="flex items-center gap-3">
        <button onClick={play} disabled={started} className="px-4 py-2 rounded bg-teal-600 text-white disabled:opacity-60">
          {started ? 'Playing…' : 'Start'}
        </button>
        {score !== null && <div className="text-sm text-gray-700">Score: {score}</div>}
      </div>
    </PhaseContainer>
  )
}

function AssociationPhase({ onComplete, autoPlay, level }: { onComplete: (score: number) => void; autoPlay?: boolean; level?: string }) {
  const [started, setStarted] = useState(false)
  const [score, setScore] = useState<number | null>(null)

  function play() {
    setStarted(true)
    setTimeout(() => {
      const base = 50
      const modifier = level === 'easy' ? -8 : level === 'hard' ? 8 : 0
      const range = level === 'hard' ? 55 : level === 'easy' ? 35 : 50
      const s = Math.floor(base + modifier + Math.random() * range)
      setScore(s)
      onComplete(s)
    }, 800)
  }

  useEffect(() => {
    if (autoPlay && !started) play()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoPlay])

  return (
    <PhaseContainer title="Phase 2 — Association">
      <p className="text-sm text-gray-600 mb-4">Match pairs and categories quickly. Placeholder demo.</p>
      <div className="flex items-center gap-3">
        <button onClick={play} disabled={started} className="px-4 py-2 rounded bg-amber-600 text-white disabled:opacity-60">
          {started ? 'Playing…' : 'Start'}
        </button>
        {score !== null && <div className="text-sm text-gray-700">Score: {score}</div>}
      </div>
    </PhaseContainer>
  )
}

function ReactionPhase({ onComplete, autoPlay, level }: { onComplete: (score: number) => void; autoPlay?: boolean; level?: string }) {
  const [started, setStarted] = useState(false)
  const [score, setScore] = useState<number | null>(null)

  function play() {
    setStarted(true)
    setTimeout(() => {
      const base = 40
      const modifier = level === 'easy' ? -6 : level === 'hard' ? 12 : 0
      const range = level === 'hard' ? 70 : level === 'easy' ? 34 : 60
      const s = Math.floor(base + modifier + Math.random() * range)
      setScore(s)
      onComplete(s)
    }, 800)
  }

  useEffect(() => {
    if (autoPlay && !started) play()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoPlay])

  return (
    <PhaseContainer title="Phase 3 — Reaction">
      <p className="text-sm text-gray-600 mb-4">React as fast as you can to the stimulus. Placeholder demo.</p>
      <div className="flex items-center gap-3">
        <button onClick={play} disabled={started} className="px-4 py-2 rounded bg-yellow-600 text-white disabled:opacity-60">
          {started ? 'Playing…' : 'Start'}
        </button>
        {score !== null && <div className="text-sm text-gray-700">Score: {score}</div>}
      </div>
    </PhaseContainer>
  )
}

function MemoryPhase({ onComplete, autoPlay, level }: { onComplete: (score: number) => void; autoPlay?: boolean; level?: string }) {
  const [started, setStarted] = useState(false)
  const [score, setScore] = useState<number | null>(null)

  function play() {
    setStarted(true)
    setTimeout(() => {
      const base = 55
      const modifier = level === 'easy' ? -8 : level === 'hard' ? 12 : 0
      const range = level === 'hard' ? 55 : level === 'easy' ? 35 : 45
      const s = Math.floor(base + modifier + Math.random() * range)
      setScore(s)
      onComplete(s)
    }, 800)
  }

  useEffect(() => {
    if (autoPlay && !started) play()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoPlay])

  return (
    <PhaseContainer title="Phase 4 — Memory">
      <p className="text-sm text-gray-600 mb-4">Short memory test (new): recall items after a short delay. Placeholder demo.</p>
      <div className="flex items-center gap-3">
        <button onClick={play} disabled={started} className="px-4 py-2 rounded bg-indigo-600 text-white disabled:opacity-60">
          {started ? 'Playing…' : 'Start'}
        </button>
        {score !== null && <div className="text-sm text-gray-700">Score: {score}</div>}
      </div>
    </PhaseContainer>
  )
}

export default function TestFlow() {
  const navigate = useNavigate()
  const { search } = useLocation()
  const [phase, setPhase] = useState(0)
  const [scores, setScores] = useState<number[]>([0, 0, 0, 0])
  // stats moved to dashboard; no per-page aggregated state needed here

  // parse query params for level; this page always runs the full combined test automatically
  const params = React.useMemo(() => new URLSearchParams(search), [search])
  const level = params.get('level') || 'medium'
  const autoMode = true
  const [countdown, setCountdown] = useState<number | null>(null)
  const [startedAfterCountdown, setStartedAfterCountdown] = useState(false)

  useEffect(() => {
    // load previous aggregate if present (optional) - no-op
    void localStorage.getItem('test_last_total')
    // start a 3..1 countdown before auto-running (gives user a moment)
    const initial = 3
    setCountdown(initial)
    const id = setInterval(() => {
      setCountdown(c => {
        if (c === null) return null
        if (c <= 1) {
          clearInterval(id)
          setTimeout(() => setCountdown(null), 200)
          setStartedAfterCountdown(true)
          return null
        }
        return c - 1
      })
    }, 700)
    return () => clearInterval(id)
  }, [])

  function handleComplete(s: number) {
    setScores(prev => {
      const next = [...prev]
      next[phase] = s
      return next
    })
    // auto-advance during combined autoMode
    if (autoMode) {
      if (phase < 3) {
        setTimeout(() => setPhase(p => p + 1), 350)
      } else {
        // ensure scores updated before finish
        setTimeout(() => finish(), 400)
      }
    }
  }

  function next() {
    if (phase < 3) setPhase(p => p + 1)
    else finish()
  }

  function finish() {
    const total = scores.reduce((a, b) => a + b, 0)
    
    // Save to Supabase
    testService.saveTestResult({
      phase_scores: scores as [number, number, number, number],
      total_score: total
    }).then(({ error }) => {
      if (error) {
        console.error('Error saving test result:', error)
      }
    })

    // Also save to localStorage for backward compatibility
    localStorage.setItem('test_last_total', String(total))
    localStorage.setItem('test_last_phase_scores', JSON.stringify(scores))
    // update simple stats: tests taken and highest score
    const prevTaken = Number(localStorage.getItem('stats_tests_taken') || '0')
    const newTaken = prevTaken + 1
    localStorage.setItem('stats_tests_taken', String(newTaken))
    // highest score aggregate updated in localStorage
    const prevBest = Number(localStorage.getItem('stats_highest_score') || '0')
    if (total > prevBest) {
      localStorage.setItem('stats_highest_score', String(total))
    }

    navigate('/games')
  }

  return (
    <div className="w-full p-8">
      <div className="max-w-3xl mx-auto space-y-6">
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/games')} className="px-3 py-2 rounded bg-gray-100">Voltar</button>
            <h1 className="text-2xl font-extrabold">Combined Cognitive Test</h1>
          </div>
          <p className="text-sm text-gray-600">Four short phases. Your per-phase and total scores are saved locally when you finish.</p>
        </header>

  {/* stats removed from this page; kept in /games dashboard */}

        <div className="space-y-4">
          {phase === 0 && <SequencePhase onComplete={handleComplete} autoPlay={autoMode && startedAfterCountdown} level={level} />}
          {phase === 1 && <AssociationPhase onComplete={handleComplete} autoPlay={autoMode && startedAfterCountdown} level={level} />}
          {phase === 2 && <ReactionPhase onComplete={handleComplete} autoPlay={autoMode && startedAfterCountdown} level={level} />}
          {phase === 3 && <MemoryPhase onComplete={handleComplete} autoPlay={autoMode && startedAfterCountdown} level={level} />}

        {/* Countdown overlay */}
        {countdown !== null && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white/90 rounded-xl p-8 text-center shadow-lg">
              <div className="text-6xl font-extrabold text-emerald-700">{countdown}</div>
              <div className="text-sm text-gray-600 mt-2">Get ready</div>
            </div>
          </div>
        )}
        </div>

        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-700">Phase {phase + 1} / 4</div>
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/games')} className="px-3 py-2 rounded bg-gray-100">Cancel</button>
            <button onClick={next} className="px-4 py-2 rounded bg-sky-600 text-white">{phase < 3 ? 'Next' : 'Finish'}</button>
          </div>
        </div>

        <div className="bg-white rounded-md border p-4">
          <h3 className="text-sm font-medium">Progress / Scores</h3>
          <div className="mt-2 text-sm text-gray-700 grid grid-cols-2 gap-2">
            <div>Sequence: {scores[0]}</div>
            <div>Association: {scores[1]}</div>
            <div>Reaction: {scores[2]}</div>
            <div>Memory: {scores[3]}</div>
            <div className="col-span-2 font-semibold">Total: {scores.reduce((a, b) => a + b, 0)}</div>
          </div>
        </div>
      </div>
    </div>
  )
}
