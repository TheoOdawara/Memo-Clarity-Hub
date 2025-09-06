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
        <section className="w-full flex justify-center items-center mt-8 px-4">
          <div className="flex flex-col lg:flex-row gap-10 w-full max-w-6xl items-center justify-center">
            {/* Grid dos cards com ordem lógica no desktop */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 grid-rows-6 sm:grid-rows-3 lg:grid-rows-2 gap-8 w-full max-w-3xl">
              {/* Coluna 1 */}
              <button
                className="flex flex-col items-center justify-center w-full h-[220px] rounded-2xl bg-gradient-to-br from-teal-400 via-teal-300 to-teal-500 text-white font-bold shadow-xl hover:scale-105 hover:shadow-2xl transition-all text-lg drop-shadow focus:outline-none focus:ring-2 focus:ring-teal-400 border-2 border-teal-200"
                onClick={() => window.location.href = '/games'}
              >
                <span className="mb-2 text-3xl">🧠</span>
                Go to Test Page
                <span className="text-xs font-normal mt-1">Challenge your mind</span>
              </button>
              <div className="flex flex-col items-center justify-center w-full h-[220px] rounded-2xl bg-white/80 backdrop-blur shadow-xl border-2 border-yellow-200">
                <span className="mb-2 text-3xl text-yellow-500">📝</span>
                <span className="text-base font-bold text-gray-900 tracking-tight mb-1 font-sans">Tests Taken</span>
                <span className="text-5xl font-extrabold text-teal-700 drop-shadow mb-2 font-sans">14</span>
              </div>
              {/* Coluna 2 */}
              <button
                className="flex flex-col items-center justify-center w-full h-[220px] rounded-2xl bg-gradient-to-br from-yellow-500 via-yellow-400 to-yellow-600 text-white font-bold shadow-xl hover:scale-105 hover:shadow-2xl transition-all text-lg drop-shadow focus:outline-none focus:ring-2 focus:ring-yellow-400 border-2 border-yellow-200"
                onClick={() => window.location.href = '/raffles'}
              >
                <span className="mb-2 text-3xl">🎁</span>
                Go to Raffle Page
                <span className="text-xs font-normal mt-1">Win exclusive prizes</span>
              </button>
              <button
                className="flex flex-col items-center justify-center w-full h-[220px] rounded-2xl bg-gradient-to-br from-yellow-400 via-yellow-300 to-yellow-500 text-white font-bold shadow-xl hover:scale-105 hover:shadow-2xl transition-all text-lg drop-shadow focus:outline-none focus:ring-2 focus:ring-yellow-400 border-2 border-yellow-200"
                onClick={() => alert('Track action')}
              >
                <span className="mb-2 text-3xl">📈</span>
                Track
                <span className="text-xs font-normal mt-1">Monitor your progress</span>
              </button>
              {/* Coluna 3 */}
              <div className="flex flex-col items-center justify-center w-full h-[220px] rounded-2xl bg-white/80 backdrop-blur shadow-xl border-2 border-teal-200">
                <span className="mb-2 text-3xl text-teal-600">🏆</span>
                <span className="text-base font-bold text-gray-900 tracking-tight mb-1 font-sans">Highest Score</span>
                <span className="text-5xl font-extrabold text-teal-700 drop-shadow mb-2 font-sans">1280</span>
              </div>
              <button
                className="flex flex-col items-center justify-center w-full h-[220px] rounded-2xl bg-gradient-to-br from-teal-500 via-teal-400 to-teal-600 text-white font-bold shadow-xl hover:scale-105 hover:shadow-2xl transition-all text-lg drop-shadow focus:outline-none focus:ring-2 focus:ring-teal-400 border-2 border-teal-200"
                onClick={() => alert('Support action')}
              >
                <span className="mb-2 text-3xl">💬</span>
                Support
                <span className="text-xs font-normal mt-1">Get help and guidance</span>
              </button>
            </div>
            {/* Área reservada para vídeo, alinhada verticalmente ao grid dos cards */}
            <div className="flex items-center justify-center w-full lg:w-[340px] min-h-[460px] bg-white/40 rounded-2xl border-2 border-dashed border-teal-200 shadow-xl">
              <span className="text-gray-400 text-lg">Área reservada para vídeo</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
