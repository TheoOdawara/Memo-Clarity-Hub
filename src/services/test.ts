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

  async cleanupDuplicateTests() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('User not authenticated')

    try {
      // Get all tests ordered by creation time
      const { data: tests } = await supabase
        .from('tests')
        .select('*')
        .eq('user_id', user.id)
        .order('completed_at', { ascending: true })

      if (!tests || tests.length <= 1) return { data: null, error: null }

      // Group tests by total_score and find potential duplicates
      const duplicateGroups = new Map<number, typeof tests>()
      
      for (const test of tests) {
        const key = test.total_score
        if (!duplicateGroups.has(key)) {
          duplicateGroups.set(key, [])
        }
        duplicateGroups.get(key)!.push(test)
      }

      // Find tests that were created very close together (likely duplicates)
      const toDelete: string[] = []
      for (const [, group] of duplicateGroups) {
        if (group.length > 1) {
          // Sort by completed_at and keep only the first one
          group.sort((a, b) => new Date(a.completed_at).getTime() - new Date(b.completed_at).getTime())
          
          for (let i = 1; i < group.length; i++) {
            const timeDiff = new Date(group[i].completed_at).getTime() - new Date(group[0].completed_at).getTime()
            // If created within 10 seconds, likely a duplicate
            if (timeDiff < 10000) {
              toDelete.push(group[i].id)
            }
          }
        }
      }

      if (toDelete.length > 0) {
        const { error } = await supabase
          .from('tests')
          .delete()
          .in('id', toDelete)

        return { data: `Removed ${toDelete.length} duplicate tests`, error }
      }

      return { data: 'No duplicates found', error: null }
    } catch (error) {
      console.error('Error cleaning up duplicates:', error)
      return { data: null, error }
    }
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
