import { supabase } from '@local/supabase/client'

// Serviço para consultar dados do Supabase (útil para debug)
export const debugService = {
  // Consultar usuários do auth
  async listUsers() {
    try {
      const { data: { users }, error } = await supabase.auth.admin.listUsers()
      console.warn('Users from auth.users available')
      return { data: users, error }
    } catch (_err) {
      console.warn('Cannot access admin functions, trying alternative...')
      return { data: null, error: _err as Error }
    }
  },

  // Consultar profiles
  async listProfiles() {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10)

      console.warn('Profiles table queried')
      return { data, error }
    } catch (_err) {
      console.error('Error querying profiles:', _err)
      return { data: null, error: _err as Error }
    }
  },

  // Consultar checkins
  async listCheckins() {
    try {
      const { data, error } = await supabase
        .from('checkins')
        .select('*')
        .order('checked_at', { ascending: false })
        .limit(10)

      console.warn('Checkins table queried')
      return { data, error }
    } catch (_err) {
      console.error('Error querying checkins:', _err)
      return { data: null, error: _err as Error }
    }
  },

  // Consultar tests
  async listTests() {
    try {
      const { data, error } = await supabase
        .from('tests')
        .select('*')
        .order('completed_at', { ascending: false })
        .limit(10)

      console.warn('Tests table queried')
      return { data, error }
    } catch (_err) {
      console.error('Error querying tests:', _err)
      return { data: null, error: _err as Error }
    }
  },

  // Verificar se tabelas existem
  async checkTables() {
    console.warn('Checking database tables...')

    const profiles = await this.listProfiles()
    const checkins = await this.listCheckins()
    const tests = await this.listTests()

    const summary = {
      profiles: profiles.error ? 'Error or missing' : `Found ${profiles.data?.length || 0} records`,
      checkins: checkins.error ? 'Error or missing' : `Found ${checkins.data?.length || 0} records`,
      tests: tests.error ? 'Error or missing' : `Found ${tests.data?.length || 0} records`
    }

    console.warn('Database summary ready')
    return summary
  },

  // Verificar usuário específico por email (se possível)
  async findUserByEmail(_email: string) {
    try {
      // Tentar via profiles primeiro usando sessão atual
      const sessionResult = await supabase.auth.getUser()
      const userId = sessionResult.data.user?.id
      if (!userId) return { data: null, error: new Error('User not authenticated') }

      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .single()

      if (profile) {
        console.warn('Found user profile')
        return { data: profile, error: null }
      }

      return { data: null, error: new Error('User not found') }
    } catch (_err) {
      console.error('Error finding user:', _err)
      return { data: null, error: _err as Error }
    }
  }
}

// Para usar no console do navegador
if (typeof window !== 'undefined') {
  ;(window as unknown as { debugSupabase?: typeof debugService }).debugSupabase = debugService
}
