import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
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

function SequencePhase({ onComplete }: { onComplete: (score: number) => void }) {
  // placeholder: score is randomized after 'Play'
  const [started, setStarted] = useState(false)
  const [score, setScore] = useState<number | null>(null)

  function play() {
    setStarted(true)
    // simulate running the mini-game and finishing
    setTimeout(() => {
      const s = Math.floor(60 + Math.random() * 40)
      setScore(s)
      onComplete(s)
    }, 800)
  }

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

function AssociationPhase({ onComplete }: { onComplete: (score: number) => void }) {
  const [started, setStarted] = useState(false)
  const [score, setScore] = useState<number | null>(null)

  function play() {
    setStarted(true)
    setTimeout(() => {
      const s = Math.floor(50 + Math.random() * 50)
      setScore(s)
      onComplete(s)
    }, 800)
  }

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

function ReactionPhase({ onComplete }: { onComplete: (score: number) => void }) {
  const [started, setStarted] = useState(false)
  const [score, setScore] = useState<number | null>(null)

  function play() {
    setStarted(true)
    setTimeout(() => {
      const s = Math.floor(40 + Math.random() * 60)
      setScore(s)
      onComplete(s)
    }, 800)
  }

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

function MemoryPhase({ onComplete }: { onComplete: (score: number) => void }) {
  const [started, setStarted] = useState(false)
  const [score, setScore] = useState<number | null>(null)

  function play() {
    setStarted(true)
    setTimeout(() => {
      const s = Math.floor(55 + Math.random() * 45)
      setScore(s)
      onComplete(s)
    }, 800)
  }

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
  const [phase, setPhase] = useState(0)
  const [scores, setScores] = useState<number[]>([0, 0, 0, 0])

  useEffect(() => {
    // load previous aggregate if present (optional)
    const existing = localStorage.getItem('test_last_total')
    if (existing) {
      // no-op for now; we show per-phase during the flow
    }
  }, [])

  function handleComplete(s: number) {
    setScores(prev => {
      const next = [...prev]
      next[phase] = s
      return next
    })
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

        <div className="space-y-4">
          {phase === 0 && <SequencePhase onComplete={handleComplete} />}
          {phase === 1 && <AssociationPhase onComplete={handleComplete} />}
          {phase === 2 && <ReactionPhase onComplete={handleComplete} />}
          {phase === 3 && <MemoryPhase onComplete={handleComplete} />}
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
