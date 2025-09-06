import React, { useState } from 'react';

export default function ProfessionalDashboard() {
  const [checkedIn, setCheckedIn] = useState(false);
  const [checkins, setCheckins] = useState(3); // Example: 3 check-ins done
  const [weekChecks, setWeekChecks] = useState([true, false, true, false, false, false, false]); // Example: week days

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-teal-50 via-white to-aqua-100 flex flex-col items-center pt-0">
      <div className="w-full flex-1 flex flex-col items-center justify-start">
        {/* Card de Check-in do Dia - Glassmorphism */}
        <section className="relative w-full bg-white/60 backdrop-blur-xl border border-teal-100 rounded-3xl shadow-2xl p-0 overflow-hidden mt-0" style={{ marginTop: 0 }}>
          {/* Gradiente animado no topo, colada e preenchendo toda a largura */}
          <div className="w-full h-2 bg-gradient-to-r from-teal-400 via-yellow-300 to-aqua-400 animate-pulse rounded-t-3xl" style={{ position: 'absolute', top: 0, left: 0, right: 0 }} />
          <div className="flex flex-col lg:flex-row items-center lg:items-center justify-center gap-6 px-8 py-8">
            <div className="flex flex-col justify-center text-center lg:text-left gap-2">
              <h2 className="text-3xl lg:text-4xl font-extrabold mb-2 font-sans tracking-tight text-teal-700 drop-shadow-lg">
                Daily Check-in
              </h2>
              <p className="text-base lg:text-lg max-w-md mx-auto lg:mx-0 mb-4 px-2 py-2 rounded-xl bg-white/60 shadow text-teal-700 font-medium backdrop-blur-md animate-fade-in">
                {checkedIn
                  ? 'Check-in completed! See you tomorrow.'
                  : 'Mark your daily check-in to keep your streak.'}
              </p>
            </div>
            {/* Beautiful weekly calendar */}
            <div className="flex flex-col items-center gap-2 bg-white/70 rounded-xl shadow p-4 mx-2">
              <span className="text-xs text-gray-500 mb-2">Week</span>
              <div className="flex gap-3">
                {["S", "T", "Q", "Q", "S", "S", "D"].map((day, idx) => (
                  <button
                    key={day + idx}
                    className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-base transition-all border-2 duration-150 focus:outline-none focus:ring-2 focus:ring-teal-400 shadow-md
                      ${weekChecks[idx] ? "bg-gradient-to-br from-teal-400 via-teal-300 to-yellow-200 text-white border-teal-400 scale-105" : "bg-white text-teal-400 border-teal-200 hover:bg-teal-50"}`}
                    onClick={() => {
                      const updated = [...weekChecks];
                      updated[idx] = !updated[idx];
                      setWeekChecks(updated);
                      if (!weekChecks[idx]) setCheckins(checkins + 1);
                      else setCheckins(checkins - 1);
                    }}
                  >
                    {day}
                  </button>
                ))}
              </div>
            </div>
            {/* Stylish check-ins counter */}
            <div className="flex flex-col items-center justify-center bg-gradient-to-br from-teal-100 via-white to-yellow-100 rounded-xl shadow p-4 mx-2 min-w-[90px]">
              <span className="text-xs text-gray-500 mb-1">Check-ins</span>
              <span className="text-4xl font-extrabold text-teal-700 drop-shadow-lg tracking-tight">{checkins}</span>
            </div>
            {/* Botão de check-in estilizado */}
            <div className="flex items-center justify-center ml-2">
              <button
                className="bg-teal-600 text-white font-bold px-6 py-3 rounded-full shadow-lg hover:bg-teal-700 hover:scale-105 hover:shadow-xl transition-all duration-150 text-lg drop-shadow focus:outline-none focus:ring-2 focus:ring-teal-400"
                onClick={() => setCheckedIn(true)}
                disabled={checkedIn}
              >
                {checkedIn ? "Checked in" : "Check-in"}
              </button>
            </div>
          </div>
        </section>
        {/* Stats and actions below check-in card */}
        <section className="w-full max-w-5xl mx-auto mt-8 flex flex-col md:flex-row items-stretch gap-6 px-4">
          <div className="flex flex-col md:flex-row gap-6 flex-1">
            <div className="flex-1 flex flex-col items-center justify-center bg-white/80 backdrop-blur rounded-2xl shadow-lg border border-gray-100 p-6 mb-4 md:mb-0">
              <span className="text-xs text-gray-500 mb-1">Highest Score</span>
              <span className="text-3xl font-extrabold text-teal-700 mb-2">1280</span>
            </div>
            <div className="flex-1 flex flex-col items-center justify-center bg-white/80 backdrop-blur rounded-2xl shadow-lg border border-gray-100 p-6 mb-4 md:mb-0">
              <span className="text-xs text-gray-500 mb-1">Tests Taken</span>
              <span className="text-3xl font-extrabold text-teal-700 mb-2">14</span>
            </div>
          </div>
          <div className="flex flex-col items-center justify-center gap-4 flex-1 bg-white/80 backdrop-blur rounded-2xl shadow-lg border border-gray-100 p-6">
            <button
              className="w-full px-4 py-3 rounded-xl bg-teal-600 text-white font-bold shadow hover:bg-teal-700 transition-all text-base"
              onClick={() => window.location.href = '/games'}
            >
              Go to Test Page
            </button>
            <button
              className="w-full px-4 py-3 rounded-xl bg-yellow-500 text-white font-bold shadow hover:bg-yellow-600 transition-all text-base"
              onClick={() => window.location.href = '/raffles'}
            >
              Go to Raffle Page
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
