import { useAuth } from '@/hooks/useAuth'

interface ProfessionalHeaderProps {
  title?: string
}

export function ProfessionalHeader({ title = "MemoClarity" }: ProfessionalHeaderProps) {
  const { user, signOut } = useAuth()
  const isDemoUser = user?.id === 'demo-user-123'

  return (
    <header className="bg-white border-b border-gray-200 h-16">
      <div className="flex items-center justify-between h-full px-6">
        {/* Logo e título */}
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
            <span className="text-white text-lg font-bold">🧠</span>
          </div>
          <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
          {isDemoUser && (
            <span className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded-md font-medium">
              DEMO
            </span>
          )}
        </div>

        {/* User section */}
        {user && (
          <div className="flex items-center space-x-4">
            {/* User info */}
            <div className="hidden sm:block text-right">
              <p className="text-sm font-medium text-gray-900">
                {isDemoUser ? 'Usuário Demo' : user.email?.split('@')[0]}
              </p>
              <p className="text-xs text-gray-500">
                {isDemoUser ? 'Conta de teste' : 'Membro ativo'}
              </p>
            </div>
            
            {/* User avatar */}
            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-gray-600">
                {isDemoUser ? 'D' : user.email?.[0]?.toUpperCase()}
              </span>
            </div>

            {/* Logout button */}
            <button
              onClick={signOut}
              className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              Sair
            </button>
          </div>
        )}
      </div>
    </header>
  )
}
