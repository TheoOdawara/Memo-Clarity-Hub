import React, { createContext, useEffect, useState } from 'react'
import { AuthContextType, AuthUser } from '@/types/auth'
import { authService } from '@/services/auth'

const AuthContext = createContext<AuthContextType | null>(null)

export { AuthContext }

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Verificar sessão inicial
    checkInitialSession()

    // Listener para mudanças de autenticação
    const { data: { subscription } } = authService.onAuthStateChange(
      async (_event, session) => {
        if (session?.user) {
          setUser(session.user as AuthUser)
        } else {
          setUser(null)
        }
        setLoading(false)
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const checkInitialSession = async () => {
    try {
      // Verificar sessão normal do Supabase
      const { session } = await authService.getCurrentSession()
      if (session?.user) {
        setUser(session.user as AuthUser)
      }
    } catch (error) {
      console.error('Erro ao verificar sessão:', error)
    } finally {
      setLoading(false)
    }
  }

  const signIn = async (email: string, password: string) => {
    setLoading(true)
    setError(null)
    
    const { data, error } = await authService.signIn(email, password)
    
    if (error) {
      // Log full error for debugging (temporary)
      console.error('Auth signIn error details:', error)
      if (error.message.includes('Invalid login credentials')) {
        setError('❌ Email ou senha incorretos. Ou conta ainda não confirmada (verifique seu email).')
      } else if (error.message.includes('Email not confirmed')) {
        setError('❌ Email ainda não confirmado. Verifique sua caixa de entrada.')
      } else {
        // show raw error to help debugging
        setError(error.message || String(error))
      }
    } else if (data?.user) {
      // Login bem-sucedido - atualizar estado do usuário
      setUser(data.user as AuthUser)
      console.warn('User logged in successfully:', data.user)
    }
    
    setLoading(false)
    return { error }
  }

  const signUp = async (email: string, password: string, userData?: Record<string, unknown>) => {
    setLoading(true)
    setError(null)
    
    const { data, error } = await authService.signUp(email, password, userData)
    
    if (error) {
      if (error.message.includes('User already registered')) {
        setError('❌ Este email já está cadastrado. Tente fazer login ou use "Esqueci minha senha".')
      } else if (error.message.includes('already registered')) {
        setError('❌ Este email já está cadastrado. Tente fazer login.')
      } else {
        setError(error.message)
      }
    }
    
    setLoading(false)
    return { data, error }
  }

  const signInWithGoogle = async () => {
    setLoading(true)
    setError(null)
    const { error: svcError } = await authService.signInWithGoogle()

    // Normalize to JS Error or null to satisfy AuthContextType
    const error = svcError ? new Error(svcError.message ?? 'Unknown error') : null

    if (error) {
      setError(error.message)
    }

    setLoading(false)
    return { error }
  }

  const signOut = async () => {
    setLoading(true)
    
    const { error } = await authService.signOut()
    
    if (error) {
      setError(error.message)
    } else {
      setUser(null)
    }
    
    setLoading(false)
  }

  const resetPassword = async (email: string) => {
    setError(null)
    const { error } = await authService.resetPassword(email)
    
    if (error) {
      setError(error.message)
    }
    
    return { error }
  }

  const resendConfirmation = async (email: string) => {
    setError(null)
    const { error } = await authService.resendConfirmation(email)
    if (error) setError(error.message)
    return { error }
  }

  const value: AuthContextType = {
    user,
    loading,
    error,
    signIn,
    signUp,
    signInWithGoogle,
    signOut,
    resetPassword,
    resendConfirmation,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
