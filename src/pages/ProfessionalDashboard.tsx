import { useState, useEffect } from 'react';
import SupportPopup from '@/components/features/SupportPopup';
import TrackPopup from '@/components/features/TrackPopup';
import InstructionsBonusesPopup from '@/components/features/InstructionsBonusesPopup';
import { useNavigate } from 'react-router-dom';
import { Brain, ArrowUpRight, Gift, Truck, MessageSquare, Info, Activity } from 'lucide-react';
import { checkinService } from '@/services/checkin';
import { toast } from 'react-hot-toast';

function SeriousCard({ title, subtitle, icon, onClick }: { title: string; subtitle?: string; icon: JSX.Element; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
  className="group relative flex flex-col sm:flex-row items-center gap-4 w-full h-[160px] sm:h-[200px] lg:h-[220px] rounded-2xl bg-white/95 border border-teal-100 shadow-sm p-4 text-left transition-transform duration-200 hover:shadow-md hover:-translate-y-0.5 backdrop-blur-[2px] ring-2 ring-teal-100/70"
    >
      {/* left accent stripe for seriousness without being dull; subtle grow on hover */}
      <div className="hidden sm:block w-1 h-full rounded-l-2xl bg-gradient-to-b from-teal-300 to-teal-100 mr-3 transition-all duration-250 group-hover:w-2" aria-hidden />
      <div className="flex-none drop-shadow-lg transition-transform duration-150 group-hover:scale-105">
        {icon}
      </div>
      <div className="flex-1">
        <div className="text-base sm:text-lg font-semibold text-gray-900">{title}</div>
        {subtitle && <div className="text-xs text-gray-500 mt-1">{subtitle}</div>}
      </div>
    </button>
  );
}

export default function ProfessionalDashboard() {
  const [checkedIn, setCheckedIn] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showSupportPopup, setShowSupportPopup] = useState(false);
  const [showTrackPopup, setShowTrackPopup] = useState(false);
  const [showInstructionsBonusesPopup, setShowInstructionsBonusesPopup] = useState(false);
  const navigate = useNavigate();
  const [streakCount, setStreakCount] = useState(0);
  const [weekChecks, setWeekChecks] = useState([false, false, false, false, false, false, false]);

  // Load checkin data when component mounts
  useEffect(() => {
    loadCheckinData();
  }, []);

  const loadCheckinData = async () => {
    try {
      setLoading(true);
      
      // Check if user already checked in today
      const { data: todayCheckin } = await checkinService.getTodayCheckin();
      setCheckedIn(!!todayCheckin);
      
      // Get streak count
      const { data: streak } = await checkinService.getStreakCount();
      setStreakCount(streak);
      
      // Get weekly checkins
      const { data: weeklyCheckins } = await checkinService.getWeeklyCheckins();
      if (weeklyCheckins) {
        const weekArray = Array(7).fill(false);
        const today = new Date();
        
        weeklyCheckins.forEach(checkin => {
          const checkinDate = new Date(checkin.checked_at);
          const dayDiff = Math.floor((today.getTime() - checkinDate.getTime()) / (1000 * 60 * 60 * 24));
          if (dayDiff >= 0 && dayDiff < 7) {
            weekArray[6 - dayDiff] = true; // Reverse order so today is last
          }
        });
        
        setWeekChecks(weekArray);
      }
    } catch (error) {
      console.error('Error loading checkin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckin = async () => {
    try {
      const { error } = await checkinService.createCheckin();
      
      if (error) {
        toast.error('Erro ao fazer check-in. Tente novamente.');
        console.error('Checkin error:', error);
        return;
      }
      
      toast.success('Check-in realizado com sucesso!');
      setCheckedIn(true);
      
      // Reload data to get updated streak
      await loadCheckinData();
    } catch (error) {
      toast.error('Erro ao fazer check-in. Tente novamente.');
      console.error('Checkin error:', error);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-teal-50 via-white to-aqua-100 flex flex-col items-center pt-0">
      <div className="w-full flex-1 flex flex-col items-center justify-start">
        {/* Card de Check-in do Dia - Glassmorphism */}
  <section className="relative w-full bg-white/60 backdrop-blur-xl rounded-3xl shadow-2xl p-0 overflow-hidden mt-0" style={{ marginTop: 0 }}>
          {/* Gradiente animado no topo, colada e preenchendo toda a largura */}
          <div className="w-full h-2 bg-gradient-to-r from-teal-400 via-yellow-300 to-aqua-400 animate-pulse rounded-t-3xl" style={{ position: 'absolute', top: 0, left: 0, right: 0 }} />
          <div className="flex flex-col lg:flex-row items-center lg:items-center justify-center gap-6 px-8 py-8">
            <div className="flex flex-col justify-center text-center lg:text-left gap-2">
              <h2 className="text-3xl lg:text-4xl font-extrabold mb-2 font-sans tracking-tight text-teal-700 drop-shadow-lg">
                Daily Check-in
              </h2>
              <p className="text-base lg:text-lg max-w-md mx-auto lg:mx-0 mb-4 px-2 py-2 rounded-xl bg-white/60 shadow text-teal-700 font-medium backdrop-blur-md animate-fade-in">
                {loading 
                  ? 'Carregando...'
                  : checkedIn
                    ? `Check-in completo! Sua sequência é de ${streakCount} dias.`
                    : 'Faça seu check-in diário para manter sua sequência.'}
              </p>
            </div>
            {/* Beautiful weekly calendar */}
            <div className="flex flex-col items-center gap-2 bg-white/70 rounded-xl shadow p-4 mx-2">
              <span className="text-xs text-gray-500 mb-2">Week</span>
              <div className="flex gap-3">
                {["S", "T", "Q", "Q", "S", "S", "D"].map((day, idx) => (
                  <div
                    key={day + idx}
                    className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-base transition-all border-2 duration-150 shadow-md
                      ${weekChecks[idx] ? "bg-gradient-to-br from-teal-400 via-teal-300 to-yellow-200 text-white border-teal-400 scale-105" : "bg-white text-teal-400 border-teal-200"}`}
                  >
                    {day}
                  </div>
                ))}
              </div>
            </div>
            {/* Stylish check-ins counter */}
            <div className="flex flex-col items-center justify-center bg-gradient-to-br from-teal-100 via-white to-yellow-100 rounded-xl shadow p-4 mx-2 min-w-[90px]">
              <span className="text-xs text-gray-500 mb-1">Sequência</span>
              <span className="text-4xl font-extrabold text-teal-700 drop-shadow-lg tracking-tight">{streakCount}</span>
            </div>
            {/* Botão de check-in estilizado */}
            <div className="flex items-center justify-center ml-2">
              <button
                className={`font-bold px-6 py-3 rounded-full shadow-lg transition-all duration-150 text-lg drop-shadow focus:outline-none focus:ring-2 focus:ring-teal-400 ${
                  checkedIn 
                    ? "bg-gray-400 text-white cursor-not-allowed" 
                    : "bg-teal-600 text-white hover:bg-teal-700 hover:scale-105 hover:shadow-xl"
                }`}
                onClick={handleCheckin}
                disabled={checkedIn || loading}
              >
                {loading ? "Carregando..." : checkedIn ? "✓ Concluído" : "Check-in"}
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
              {/* Go to Test Page - Estilo Criativo */}
              <button className="relative flex flex-col items-center justify-center w-full h-[220px] rounded-2xl bg-teal-500 text-white font-bold shadow-xl overflow-hidden transition-all duration-300 ease-in-out hover:shadow-2xl hover:scale-105 focus:outline-none focus:ring-2 focus:ring-teal-300" onClick={() => navigate('/games')}>
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full animate-pulse"></div>
                <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-white/10 rounded-lg rotate-45"></div>
                <span className="mb-4 z-10">
                  <div className="relative w-[76px] h-[76px]">
                    {/* Glow tint */}
                    <div className="absolute inset-0 rounded-full bg-cyan-200/30 blur-md"></div>
                    {/* Outer frame (colored) */}
                    <div className="absolute inset-0 rounded-full border-[2.5px] border-cyan-200" />
                    {/* Inner frame (neutral) */}
                    <div className="absolute inset-1 rounded-full border-2 border-white/60" />
                    {/* Soft inner fill */}
                    <div className="absolute inset-2 rounded-full bg-white/10 backdrop-blur-[1px]" />
                    {/* Brain icon */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Brain size={36} strokeWidth={2.5} className="text-white" />
                    </div>
                    {/* Corner badge arrow (clean) */}
                    <div className="absolute -right-1 -top-1 bg-white rounded-full p-1 shadow-sm">
                      <ArrowUpRight size={18} strokeWidth={2.5} className="text-teal-600" />
                    </div>
                  </div>
                </span>
                <span className="z-10">Go to Test Page</span>
                <span className="text-xs font-normal mt-1 z-10">Challenge your mind</span>
              </button>
              {/* Sound Lab — attractive but distinct (indigo) */}
              {/* Frequency Sessions — softened attractive card */}
              <button
                onClick={() => navigate('/sound')}
                className="relative flex flex-col items-center justify-center w-full h-[220px] rounded-2xl bg-gradient-to-br from-indigo-600 via-violet-500 to-cyan-500 text-white font-bold shadow-lg overflow-hidden transition-transform duration-200 hover:shadow-2xl hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                type="button"
                aria-label="Open Frequency Sessions"
              >
                {/* background wave removed to avoid white line across card */}

                <span className="mb-4 z-10">
                  <div className="relative w-[76px] h-[76px]">
                    {/* Glow tint */}
                    <div className="absolute inset-0 rounded-full bg-indigo-300/30 blur-md"></div>
                    {/* Outer frame (colored) */}
                    <div className="absolute inset-0 rounded-full border-[2.5px] border-indigo-300" />
                    {/* Inner frame (neutral) */}
                    <div className="absolute inset-1 rounded-full border-2 border-white/60" />
                    {/* Soft inner fill */}
                    <div className="absolute inset-2 rounded-full bg-white/6" />
                    {/* Activity icon centered */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Activity size={30} strokeWidth={1.8} className="text-white" />
                    </div>
                    {/* Corner badge arrow (clean) */}
                    <div className="absolute -right-1 -top-1 bg-white rounded-full p-1 shadow-sm">
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-indigo-600">
                        <rect x="1" y="3" width="2" height="8" rx="0.5" fill="currentColor" />
                        <rect x="6" y="1" width="2" height="10" rx="0.5" fill="currentColor" />
                        <rect x="11" y="4" width="2" height="7" rx="0.5" fill="currentColor" />
                      </svg>
                    </div>
                  </div>
                </span>

                <div className="z-10 text-2xl text-white drop-shadow-md">Frequency Sessions</div>
              </button>

              {/* Go to Raffle Page - Gift with layered frame, gradient background restored */}
              <button
                className="relative flex flex-col items-center justify-center w-full h-[220px] rounded-2xl bg-gradient-to-br from-yellow-500 via-yellow-400 to-yellow-600 text-white font-bold shadow-xl overflow-hidden transition-all duration-300 ease-in-out hover:shadow-2xl hover:scale-105 focus:outline-none focus:ring-2 focus:ring-yellow-300 border-[3px] border-yellow-300"
                onClick={() => window.location.href = '/raffles'}
              >
                <span className="mb-4 z-10">
                  <div className="relative w-[76px] h-[76px]">
                    {/* Glow tint */}
                    <div className="absolute inset-0 rounded-full bg-amber-200/24 blur-md"></div>
                    {/* Outer frame (more white) */}
                    <div className="absolute inset-0 rounded-full border-[3px] border-white/80" />
                    {/* Inner frame (neutral) */}
                    <div className="absolute inset-1 rounded-full border-2 border-white/60" />
                    {/* Soft inner fill */}
                    <div className="absolute inset-2 rounded-full bg-white/10 backdrop-blur-[1px]" />
                    {/* Gift icon */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Gift size={36} strokeWidth={2.5} className="text-white" />
                    </div>
                    {/* Corner badge - small star */}
                    <div className="absolute -right-1 -top-1 bg-white rounded-full p-1 shadow-sm">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2l2.09 4.26L18.5 7l-3.25 2.7L15.82 14 12 11.8 8.18 14l.57-4.3L5.5 7l4.41-.74L12 2z" fill="#f59e0b"/>
                      </svg>
                    </div>
                  </div>
                </span>
                <span className="z-10">Go to Raffle Page</span>
                <span className="text-xs font-normal mt-1 z-10">Win exclusive prizes</span>
              </button>

              {/* Instructions & Bonuses card (opens premium modal) */}
              <SeriousCard
                title="Instructions & Bonuses"
                subtitle="Guides and exclusive resources"
                onClick={() => setShowInstructionsBonusesPopup(true)}
                icon={
                  <div className="relative w-14 h-14 flex items-center justify-center rounded-full bg-white border border-amber-400 shadow-inner overflow-hidden">
                    <div className="absolute inset-0 rounded-full bg-amber-400/10" aria-hidden />
                    <div className="absolute -inset-px rounded-full border-2 border-amber-400/60" aria-hidden />
                    <div className="absolute inset-0 rounded-full blur-sm opacity-40 bg-gradient-to-br from-amber-200 to-white" aria-hidden />
                    <Info size={20} strokeWidth={1.8} className="text-amber-500 relative z-10" />
                  </div>
                }
              />
              {/* Coluna 3 */}
              <SeriousCard
                title="Track"
                subtitle="Access order tracking"
                onClick={() => setShowTrackPopup(true)}
                icon={
                  <div className="relative w-14 h-14 flex items-center justify-center rounded-full bg-white border border-teal-50 shadow-inner overflow-hidden">
                    {/* soft inner fill */}
                    <div className="absolute inset-0 rounded-full bg-teal-50/10" aria-hidden />
                    {/* small colored ring */}
                    <div className="absolute -inset-px rounded-full border-2 border-teal-100/60" aria-hidden />
                    {/* subtle glow */}
                    <div className="absolute inset-0 rounded-full blur-sm opacity-40 bg-gradient-to-br from-teal-100 to-white" aria-hidden />
                    <Truck size={20} strokeWidth={1.8} className="text-teal-600 relative z-10" />
                  </div>
                }
              />
              <SeriousCard
                title="Support"
                subtitle="Get help and guidance"
                onClick={() => setShowSupportPopup(true)}
                icon={<div className="w-14 h-14 flex items-center justify-center rounded-full bg-white border border-teal-50 shadow-inner overflow-hidden relative"><div className="absolute inset-0 rounded-full bg-white/60" aria-hidden /><div className="absolute -inset-px rounded-full border border-teal-100/40" aria-hidden /><MessageSquare size={20} strokeWidth={1.8} className="text-teal-600 relative z-10" /></div>}
              />
            </div>
            {/* Área reservada para vídeo, alinhada verticalmente ao grid dos cards */}
            <div className="flex items-center justify-center w-full lg:w-[340px] min-h-[460px] bg-white/40 rounded-2xl border-2 border-dashed border-teal-200 shadow-xl">
              <span className="text-gray-400 text-lg">Área reservada para vídeo</span>
            </div>
          </div>
          <SupportPopup open={showSupportPopup} onClose={() => setShowSupportPopup(false)} />
          <TrackPopup open={showTrackPopup} onClose={() => setShowTrackPopup(false)} />
          <InstructionsBonusesPopup open={showInstructionsBonusesPopup} onClose={() => setShowInstructionsBonusesPopup(false)} />
        </section>
        {showInstructions && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/40" onClick={() => setShowInstructions(false)} />
            <div className="relative bg-white rounded-2xl shadow-xl max-w-lg w-full mx-4 p-6 z-10">
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-xl font-bold">When & How to take the Frequency Test</h3>
                <button className="text-gray-500 hover:text-gray-700" onClick={() => setShowInstructions(false)}>Close</button>
              </div>
              <div className="text-sm text-gray-700 space-y-3">
                <p>Prepare a quiet room with minimal background noise. Prefer using headphones for best results.</p>
                <p>During the test you will hear tones at different frequencies. Stay still and avoid background conversations.</p>
                <p>Ensure volume is comfortable but audible; do not set audio to maximum to avoid discomfort.</p>
                <p>If using mobile, hold the device steady and use headphones when possible. Follow on-screen prompts and answer honestly.</p>
              </div>
              <div className="mt-6 flex justify-end">
                <button onClick={() => setShowInstructions(false)} className="px-4 py-2 bg-teal-600 text-white rounded-lg">Got it</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
