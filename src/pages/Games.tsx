import { FileText, Trophy, Rocket } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

export default function Games() {
  const navigate = useNavigate();
  // raw values from storage (we animate displayed counters below)
  // displayed counters for subtle count-up animation
  const [displayedTaken, setDisplayedTaken] = useState<number>(0)
  const [displayedBest, setDisplayedBest] = useState<number>(0)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
  const taken = Number(localStorage.getItem('stats_tests_taken') || '0')
  const best = Number(localStorage.getItem('stats_highest_score') || '0')

    // animate counters (simple interval-based ease)
    const animate = (from: number, to: number, setter: (v: number) => void) => {
      const duration = 700
      const stepMs = 30
      const steps = Math.max(1, Math.floor(duration / stepMs))
      const increment = (to - from) / steps
      let current = from
      setter(Math.round(current))
      const id = setInterval(() => {
        current += increment
        if ((increment > 0 && current >= to) || (increment < 0 && current <= to)) {
          setter(to)
          clearInterval(id)
        } else {
          setter(Math.round(current))
        }
      }, stepMs)
      return id
    }

    const id1 = animate(0, taken, setDisplayedTaken)
    const id2 = animate(0, best, setDisplayedBest)
    // mount animations
    const t = setTimeout(() => setMounted(true), 80)
    return () => {
      clearInterval(id1)
      clearInterval(id2)
      clearTimeout(t)
    }
  }, [])

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-white to-emerald-50 p-6 md:p-12">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          <main className="lg:col-span-9">
            <div className="flex items-center gap-4 mb-6">
              <button onClick={() => navigate('/dashboard')} className="px-3 py-2 rounded bg-white/90 hover:bg-white shadow-sm">Voltar</button>
              <div>
                  <h1 className="text-3xl md:text-4xl font-extrabold text-emerald-800">Train your brain — feel the progress</h1>
              </div>
            </div>

            <section className="mb-8">
              <div className={`rounded-3xl p-8 md:p-10 bg-gradient-to-r from-emerald-600 via-teal-400 to-cyan-400 shadow-2xl text-white relative overflow-hidden transform transition-all ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'} duration-500`}>
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                  <div className="md:col-span-8">
                    <h2 className="text-4xl md:text-5xl font-extrabold leading-tight">Start the test — sharpen your mind</h2>
                    <p className="mt-3 text-white/95 max-w-2xl text-lg">Four short phases that train memory, reaction and association. Quick to start, clear progress each session.</p>
                    <div className="mt-5 flex items-center gap-3">
                      <span className="inline-flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full text-sm">4 phases</span>
                      <span className="inline-flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full text-sm">2–5 min</span>
                    </div>
                  </div>

                  <div className="md:col-span-4 flex justify-end">
                    <div className="flex items-center justify-center w-full">
                      <button onClick={() => navigate('/games/test?level=medium')} className="px-8 py-3 rounded-full bg-white text-emerald-700 font-semibold shadow-2xl hover:scale-105 transform-gpu transition-all duration-200 flex items-center gap-3 text-lg">
                        <span>Start 5‑min test</span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-700"><path d="M5 3v18l15-9z"></path></svg>
                      </button>
                    </div>
                  </div>
                </div>

                <div className="pointer-events-none absolute -right-12 top-6 w-56 h-56 rounded-full bg-white/10 opacity-30 blur-3xl" />
                <div className="pointer-events-none absolute -left-14 bottom-6 w-40 h-40 rounded-full bg-white/6 opacity-20 blur-2xl" />
              </div>
            </section>

            <section>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className={`p-6 rounded-2xl bg-white shadow border border-emerald-100 transform transition-all duration-500 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                  <div className="flex items-center gap-4">
                    <div className="p-2 rounded-full bg-emerald-50"><FileText size={20} className="text-emerald-700" /></div>
                    <div>
                      <div className="text-sm text-gray-600">Tests Taken</div>
                      <div className="text-3xl font-extrabold text-emerald-800">{displayedTaken}</div>
                    </div>
                  </div>
                  <div className="mt-3 text-xs text-emerald-700">Total sessions completed</div>
                </div>

                <div className={`p-6 rounded-2xl bg-white shadow border border-teal-100 transform transition-all duration-500 ${mounted ? 'opacity-100 translate-y-0 delay-150' : 'opacity-0 translate-y-4'}`}>
                  <div className="flex items-center gap-4">
                    <div className="p-2 rounded-full bg-teal-50"><Trophy size={20} className="text-teal-700" /></div>
                    <div>
                      <div className="text-sm text-gray-600">Highest Score</div>
                      <div className="text-3xl font-extrabold text-teal-800">{displayedBest}</div>
                    </div>
                  </div>
                  <div className="mt-3 text-xs text-teal-700">Best total score</div>
                </div>
              </div>
            </section>
          </main>

          <aside className="lg:col-span-3">
            <div className="sticky top-24 space-y-6">
              <div className="p-6 rounded-2xl bg-white shadow border border-emerald-100">
                <h3 className="text-sm font-semibold text-gray-700">Quick tips</h3>
                <p className="mt-2 text-sm text-gray-600">Find a comfortable spot, focus on each mini-game, and try to improve your score every session. Consistency is key for cognitive progress!</p>
              </div>

              <div className="relative overflow-hidden p-7 rounded-2xl bg-gradient-to-br from-cyan-100 via-white to-emerald-50 shadow-xl border border-cyan-200 flex flex-col items-start animate-fade-in">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-3 rounded-full bg-cyan-600 shadow-lg flex items-center justify-center">
                    <Rocket size={28} className="text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-cyan-700 drop-shadow">10-Day Brain Challenge</h3>
                </div>
                <p className="text-base text-gray-700 mb-4 max-w-xs">Boost your cognitive power with a 10-day challenge! Get the ebook and daily exercises to stimulate your mind.</p>
                <a href="https://globalhealthnews.online/ebook/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-cyan-600 text-white font-semibold shadow-lg hover:bg-cyan-700 transition-all text-base hover:scale-105">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                  Access Challenge
                </a>
                <div className="absolute right-0 bottom-0 w-24 h-24 bg-cyan-200 opacity-30 rounded-full blur-2xl" />
                <div className="absolute left-0 top-0 w-16 h-16 bg-emerald-200 opacity-20 rounded-full blur-xl" />
              </div>

            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
