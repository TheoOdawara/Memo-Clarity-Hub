import { useAuth } from '@/hooks/useAuth'
import LogoParaQualquerFundo from '@/assets/LogoParaQualquerFundo.png'

interface ProfessionalHeaderProps {
  title?: string
}

export function ProfessionalHeader({ title = "MemoClarity" }: ProfessionalHeaderProps) {
  const { user, signOut } = useAuth()
  const isDemoUser = user?.id === 'demo-user-123'

  return (
    <header className="bg-white/80 backdrop-blur border-b border-gray-200 shadow-sm h-20 flex items-center">
      <div className="flex items-center justify-between w-full px-4 sm:px-8">
        {/* Logo e título */}
        <div className="flex items-center space-x-3">
          <img src={LogoParaQualquerFundo} alt="MemoClarity Logo" className="w-12 h-12 object-contain drop-shadow-xl" />
          <h1 className="text-2xl font-bold text-teal-900 font-sans tracking-tight">{title}</h1>
          {isDemoUser && (
            <span className="px-2 py-1 text-xs text-green-700 font-medium">
              DEMO
            </span>
          )}
        </div>

        {/* User section + botões de ação */}
        {user && (
          <div className="flex items-center space-x-2">
            {/* Botões de ação à esquerda do usuário */}
            <button
              className="px-4 py-2 rounded-full bg-teal-600 text-white font-bold shadow hover:bg-teal-700 transition-all text-sm flex items-center justify-center gap-2"
              style={{ minWidth: 0 }}
            >
              Support
            </button>
            <button
              className="px-4 py-2 rounded-full bg-yellow-500 text-white font-bold shadow hover:bg-yellow-600 transition-all text-sm flex items-center justify-center gap-2"
              style={{ minWidth: 0 }}
            >
              Track
            </button>
            {/* Bloco do usuário */}
            <div className="hidden sm:block text-right mr-2">
              <p className="text-sm font-semibold text-teal-800">
                {isDemoUser ? 'Demo User' : user.email?.split('@')[0]}
              </p>
              <p className="text-xs text-gray-500">
                {isDemoUser ? 'Test Account' : 'Active Member'}
              </p>
            </div>
            <div className="w-9 h-9 bg-teal-200 rounded-full flex items-center justify-center border border-teal-300">
              <span className="text-base font-bold text-teal-700">
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
