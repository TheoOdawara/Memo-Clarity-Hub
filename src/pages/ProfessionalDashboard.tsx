import React, { useState } from 'react';

export default function ProfessionalDashboard() {
  const [checkedIn, setCheckedIn] = useState(false);

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-teal-50 via-white to-aqua-100 flex justify-center items-start py-8">
      <div className="w-full max-w-3xl px-2 sm:px-6">
        {/* Card de Check-in do Dia - Glassmorphism */}
        <section className="relative bg-white/60 backdrop-blur-xl border border-teal-100 rounded-2xl shadow-2xl p-0 overflow-hidden mb-8">
          {/* Gradiente animado no topo */}
          <div className="absolute inset-x-0 top-0 h-2 bg-gradient-to-r from-teal-400 via-yellow-300 to-aqua-400 animate-pulse" />
          <div className="flex flex-col lg:flex-row items-center lg:items-center justify-between gap-4 px-4 py-6">
            <div className="flex-1 flex flex-col justify-center text-center lg:text-left gap-2">
              <h2 className="text-2xl lg:text-2xl font-bold text-teal-900 mb-1 font-sans tracking-tight">
                Daily Check-in
              </h2>
              <p className="text-gray-700 text-base lg:text-base max-w-md mx-auto lg:mx-0">
                {checkedIn
                  ? 'Check-in completed! See you tomorrow.'
                  : 'Mark your daily check-in to keep your streak.'}
              </p>
            </div>
            <div
              className="relative rounded-2xl bg-white bg-opacity-60 backdrop-blur-lg shadow-xl px-4 py-6 flex flex-col gap-4 items-center w-full max-w-xs mx-auto lg:mx-0"
              style={{
                border: '1.5px solid rgba(173, 255, 247, 0.15)',
                boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
                // ...existing code...
              }}
            >
              {/* Conteúdo do card, como botão de check-in, progresso, etc. */}
            </div>
          </div>
        </section>
        {/* ...outros elementos do dashboard... */}
      </div>
    </div>
  );
}
