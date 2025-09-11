import { supabase } from '@/integrations/supabase/client'
import { Session } from '@supabase/supabase-js'

export const authService = {
  // Login com email e senha
  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
  // Log auth response for debugging (temporary)
  console.error('signIn response', { data, error })
    return { data, error }
  },

  // Registro com email e senha
  async signUp(email: string, password: string, userData?: Record<string, unknown>) {
    console.warn('Starting signUp process...', { email, userData })

    try {
      // Primeiro, fazer o signUp no Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData,
          emailRedirectTo: `${window.location.origin}/`,
        },
      })

      console.warn('Supabase signUp response:', { data, error })

      if (error) {
        console.error('SignUp error:', error)
        return { data: null, error }
      }

      // Para signUp, não criamos o profile imediatamente
      // Ele será criado quando o usuário confirmar o email e fizer login
      // Isso evita problemas com RLS e timing

      return { data, error: null }
    } catch (err) {
      console.error('Unexpected error in signUp:', err)
      return { data: null, error: err as Error }
    }
  },

  // Resend confirmation using a magic link (OTP) as a safe fallback
  async resendConfirmation(email: string) {
    // signInWithOtp sends a magic link to the email which logs in the user without confirmation
    const { data, error } = await supabase.auth.signInWithOtp({ email })
    return { data, error }
  },

  // Login com Google (implementar depois com chaves do cliente)
  async signInWithGoogle() {
    return { data: null, error: { message: 'Google OAuth será implementado em breve' } }
  },

  // Logout
  async signOut() {
    const { error } = await supabase.auth.signOut()
    return { error }
  },

  // Reset de senha
  async resetPassword(email: string) {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    })
    return { data, error }
  },

  // Obter usuário atual
  async getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser()
    return { user, error }
  },

  // Obter sessão atual
  async getCurrentSession() {
    const { data: { session }, error } = await supabase.auth.getSession()
    return { session, error }
  },

  // Listener para mudanças de autenticação
  onAuthStateChange(callback: (event: string, session: Session | null) => void) {
    return supabase.auth.onAuthStateChange(callback)
  },
}
