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
            <span className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded-md font-medium">
              DEMO
            </span>
          )}
        </div>

        {/* User section + botões de ação */}
        {user && (
          <div className="flex items-center space-x-2">
            {/* Botões de ação à esquerda do usuário */}
            <button
              className="px-2 py-1 rounded-lg bg-teal-600 text-white font-medium shadow hover:bg-teal-700 transition-colors text-xs"
              style={{ minWidth: 0 }}
            >
              Suporte
            </button>
            <button
              className="px-2 py-1 rounded-lg bg-yellow-500 text-white font-medium shadow hover:bg-yellow-600 transition-colors text-xs"
              style={{ minWidth: 0 }}
            >
              Rastrear
            </button>
            {/* Bloco do usuário */}
            <div className="hidden sm:block text-right mr-2">
              <p className="text-sm font-medium text-gray-900">
                {isDemoUser ? 'Usuário Demo' : user.email?.split('@')[0]}
              </p>
              <p className="text-xs text-gray-500">
                {isDemoUser ? 'Conta de teste' : 'Membro ativo'}
              </p>
            </div>
            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-gray-600">
                {isDemoUser ? 'D' : user.email?.[0]?.toUpperCase()}
              </span>
            </div>
            <button
              onClick={signOut}
              className="text-xs text-gray-600 hover:text-gray-900 transition-colors ml-2"
            >
              Sair
            </button>
          </div>
        )}
      </div>
    </header>
  )
}
