import { useContext } from 'react'
import { AuthContext } from '@/contexts/AuthContext'

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === null) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

// Hook adicional para verificar se está autenticado
export function useIsAuthenticated() {
  const { user, loading } = useAuth()
  return { isAuthenticated: !!user && !loading, loading }
}

// Hook para dados do usuário
export function useUser() {
  const { user } = useAuth()
  return user
}
