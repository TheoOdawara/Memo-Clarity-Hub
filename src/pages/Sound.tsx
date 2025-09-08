import { useNavigate } from 'react-router-dom'
import { Volume2 } from 'lucide-react'

export default function SoundPage() {
  const navigate = useNavigate()

  return (
    <div className="w-full p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate(-1)} className="px-3 py-2 rounded bg-gray-100">Voltar</button>
            <h1 className="text-2xl font-extrabold">Sound Lab</h1>
          </div>
          <p className="text-sm text-gray-600">Audio sessions for memory, relaxation and focus</p>
        </header>

        <section className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-full bg-cyan-50 flex items-center justify-center">
                <Volume2 className="text-cyan-600" />
              </div>
              <div>
                <div className="text-sm font-semibold">Memory Boost</div>
                <div className="text-xs text-gray-500">Binaural beats at 6 Hz</div>
              </div>
            </div>
            <p className="text-sm text-gray-600">Short demo session to help with memory consolidation. Use headphones for best results.</p>
            <div className="mt-4">
              <div className="h-10 bg-gray-100 rounded flex items-center px-3">Player placeholder</div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-full bg-cyan-50 flex items-center justify-center">
                <Volume2 className="text-cyan-600" />
              </div>
              <div>
                <div className="text-sm font-semibold">Deep Sleep</div>
                <div className="text-xs text-gray-500">Isochronic tones at 2 Hz</div>
              </div>
            </div>
            <p className="text-sm text-gray-600">Relaxing tone designed to help induce deep sleep. Lower volume recommended.</p>
            <div className="mt-4">
              <div className="h-10 bg-gray-100 rounded flex items-center px-3">Player placeholder</div>
            </div>
          </div>
        </section>

        <div className="text-sm text-gray-500">This page is a placeholder. We'll wire actual audio controls and presets next.</div>
      </div>
    </div>
  )
}
