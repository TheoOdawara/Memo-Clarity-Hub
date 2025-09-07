import { supabase } from '@/integrations/supabase/client'
import { Session } from '@supabase/supabase-js'

export const authService = {
  // Login com email e senha
  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    return { data, error }
  },

  // Registro com email e senha
  async signUp(email: string, password: string, userData?: Record<string, unknown>) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData,
      },
    })

    // Create profile after successful signup
    if (data.user && !error) {
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          user_id: data.user.id,
          username: userData?.username as string || null,
          avatar_url: null
        })
      
      if (profileError) {
        console.error('Error creating profile:', profileError)
        // Don't fail the signup if profile creation fails
      }
    }

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
