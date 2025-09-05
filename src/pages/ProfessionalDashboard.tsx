import React from 'react';

export default function ProfessionalDashboard() {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-teal-50 via-white to-aqua-100 flex justify-center items-start py-8">
      <div className="w-full max-w-3xl px-2 sm:px-6">
        {/* Card de Check-in do Dia - Visual sofisticado */}
        <section className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-4 sm:p-6 flex flex-col sm:flex-row items-center sm:items-start justify-between mb-8">
          <div className="flex items-center gap-4 w-full">
            <div className="w-12 h-12 rounded-xl bg-teal-100 flex items-center justify-center shadow-md">
              <svg
                className="w-7 h-7 text-teal-700"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4" />
              </svg>
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-teal-900 mb-1 font-sans tracking-tight">
                Daily Check-in
              </h2>
              <p className="text-gray-600 text-base">
                Stay consistent and track your progress every day.
              </p>
            </div>
          </div>
          <button className="mt-4 sm:mt-0 px-5 py-2 rounded-xl bg-teal-600 text-white font-semibold shadow hover:bg-teal-700 transition-colors text-base font-sans tracking-tight focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-offset-2">
            Check-in Now
          </button>
        </section>
        {/* ...outros elementos do dashboard... */}
      </div>
    </div>
  );
}
