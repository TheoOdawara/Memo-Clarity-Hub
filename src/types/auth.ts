import { User } from '@supabase/supabase-js'

export type AuthUser = User

export interface AuthState {
  user: AuthUser | null
  loading: boolean
  error: string | null
}

export interface AuthContextType extends AuthState {
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>
  signUp: (email: string, password: string, userData?: Record<string, unknown>) => Promise<{ error: Error | null }>
  signInWithGoogle: () => Promise<{ error: Error | null }>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<{ error: Error | null }>
  resendConfirmation: (email: string) => Promise<{ error: Error | null }>
  loginDemo: () => void
}
