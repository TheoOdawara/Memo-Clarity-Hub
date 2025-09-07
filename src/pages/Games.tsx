import { Shuffle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Games() {
  const navigate = useNavigate();

  return (
    <div className="w-full p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <div className="flex justify-start mb-2">
            <button onClick={() => navigate('/dashboard')} className="px-3 py-2 rounded bg-gray-100">
              Voltar
            </button>
          </div>
          <header>
            <h1 className="text-2xl font-extrabold text-gray-900">Cognitive Exercises</h1>
            <p className="text-sm text-gray-500 mt-1">Short exercises to train memory and reaction time.</p>
          </header>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <button
            onClick={() => navigate('/games/test')}
            className="col-span-1 sm:col-span-2 lg:col-span-3 flex flex-col items-center justify-center gap-3 rounded-2xl bg-white/95 border border-teal-100 shadow-md p-6 hover:shadow-lg transition"
          >
            <div className="relative w-20 h-20 flex items-center justify-center rounded-full bg-gradient-to-br from-indigo-50 to-white border border-indigo-100">
              <div className="absolute inset-0 rounded-full bg-indigo-50/10" aria-hidden />
              <Shuffle size={28} className="text-indigo-600" />
            </div>
            <div className="text-base font-semibold text-gray-900">Start Combined Test</div>
            <div className="text-xs text-gray-500">4 phases: Sequence, Association, Reaction and Memory</div>
          </button>
        </div>
      </div>
    </div>
  );
}
