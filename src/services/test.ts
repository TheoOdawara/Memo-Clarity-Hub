import { supabase } from '@/integrations/supabase/client'

export type TestResult = {
  phase_scores: [number, number, number, number] // [sequence, association, reaction, memory]
  total_score: number
}

export const testService = {
  async saveTestResult(result: TestResult) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('User not authenticated')

    const { data, error } = await supabase
      .from('tests')
      .insert({
        user_id: user.id,
        phase_scores: result.phase_scores,
        total_score: result.total_score
      })
      .select()
      .single()

    return { data, error }
  },

  async getUserTests(limit = 10) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('User not authenticated')

    const { data, error } = await supabase
      .from('tests')
      .select('*')
      .eq('user_id', user.id)
      .order('completed_at', { ascending: false })
      .limit(limit)

    return { data, error }
  },

  async getLastTestResult() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('User not authenticated')

    const { data, error } = await supabase
      .from('tests')
      .select('*')
      .eq('user_id', user.id)
      .order('completed_at', { ascending: false })
      .limit(1)
      .single()

    return { data, error }
  },

  async getBestScore() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('User not authenticated')

    const { data, error } = await supabase
      .from('tests')
      .select('total_score')
      .eq('user_id', user.id)
      .order('total_score', { ascending: false })
      .limit(1)
      .single()

    return { data: data?.total_score || 0, error }
  },

  async getAverageScore() {
    const { data: tests, error } = await this.getUserTests(100) // Get more tests for better average
    
    if (error || !tests || tests.length === 0) {
      return { data: 0, error }
    }

    const average = tests.reduce((sum, test) => sum + test.total_score, 0) / tests.length
    return { data: Math.round(average), error: null }
  }
}
