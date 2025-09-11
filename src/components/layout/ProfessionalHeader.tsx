import { useAuth } from '@/hooks/useAuth'
import LogoParaQualquerFundo from '@/assets/LogoParaQualquerFundo.png'

interface ProfessionalHeaderProps {
  title?: string
}

export function ProfessionalHeader({ title = "MemoClarity" }: ProfessionalHeaderProps) {
  const { user, signOut } = useAuth()
  const isDemoUser = user?.id === 'demo-user-123'

  return (
    <header className="bg-white/80 backdrop-blur border-b border-gray-200 shadow-sm h-20 flex items-center w-full overflow-x-auto">
      <div className="flex flex-nowrap items-center justify-between w-full px-2 sm:px-8 max-w-full min-w-0 gap-2">
        {/* Logo e título */}
  <div className="flex items-center space-x-2 max-w-full overflow-hidden">
          <img src={LogoParaQualquerFundo} alt="MemoClarity Logo" className="w-10 h-10 object-contain drop-shadow-xl flex-shrink-0" />
          <h1 className="text-lg sm:text-2xl font-bold text-teal-900 font-sans tracking-tight truncate max-w-[120px] sm:max-w-none">{title}</h1>
          {isDemoUser && (
            <span className="px-1 py-0.5 text-xs text-green-700 font-medium truncate">DEMO</span>
          )}
        </div>

        {/* User section + botões de ação */}
        {user && (
          <div className="flex items-center space-x-2 max-w-full overflow-hidden">
            {/* Botões de ação removidos do header para migrar ao dashboard */}
            {/* Bloco do usuário */}
            <div className="hidden sm:block text-right mr-2">
              <p className="text-sm font-semibold text-teal-800">
                {isDemoUser ? 'Demo User' : user.email?.split('@')[0]}
              </p>
              <p className="text-xs text-gray-500">
                {isDemoUser ? 'Test Account' : 'Active Member'}
              </p>
            </div>
            <div className="w-7 h-7 sm:w-9 sm:h-9 bg-teal-200 rounded-full flex items-center justify-center border border-teal-300 flex-shrink-0">
              <span className="text-xs sm:text-base font-bold text-teal-700">
                {isDemoUser ? 'D' : user.email?.[0]?.toUpperCase()}
              </span>
            </div>
            <button
              onClick={signOut}
              className="px-4 py-2 rounded-full bg-gray-100 text-teal-700 font-bold shadow hover:bg-gray-200 transition-all text-sm ml-2 border border-teal-200"
            >
              Sign out
            </button>
          </div>
        )}
      </div>
    </header>
  )
}
