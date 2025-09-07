import { supabase } from '@local/supabase/client'

export type CheckinData = {
  mood_score?: number
  notes?: string
}

export const checkinService = {
  async createCheckin(data: CheckinData = {}) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('User not authenticated')

    const { data: checkin, error } = await supabase
      .from('checkins')
      .insert({
        user_id: user.id,
        mood_score: data.mood_score,
        notes: data.notes
      })
      .select()
      .single()

    return { data: checkin, error }
  },

  async getUserCheckins(limit = 30) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('User not authenticated')

    const { data, error } = await supabase
      .from('checkins')
      .select('*')
      .eq('user_id', user.id)
      .order('checked_at', { ascending: false })
      .limit(limit)

    return { data, error }
  },

  async getTodayCheckin() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('User not authenticated')

    const today = new Date().toISOString().split('T')[0]
    
    const { data, error } = await supabase
      .from('checkins')
      .select('*')
      .eq('user_id', user.id)
      .gte('checked_at', `${today}T00:00:00.000Z`)
      .lt('checked_at', `${today}T23:59:59.999Z`)
      .single()

    return { data, error }
  },

  async getStreakCount() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('User not authenticated')

    const { data, error } = await supabase
      .from('profiles')
      .select('streak_count')
      .eq('user_id', user.id)
      .single()

    return { data: data?.streak_count || 0, error }
  }
}
