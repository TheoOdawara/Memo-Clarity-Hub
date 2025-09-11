import { supabase } from '@/integrations/supabase/client'

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
      .maybeSingle()

    return { data, error }
  },

  async getStreakCount() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('User not authenticated')

    const { data, error } = await supabase
      .from('profiles')
      .select('streak_count, last_checkin_date')
      .eq('user_id', user.id)
      .maybeSingle()

    return { data: data?.streak_count || 0, error }
  },

  async getWeeklyCheckins() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('User not authenticated')

    // Get checkins from the last 7 days
    const weekAgo = new Date()
    weekAgo.setDate(weekAgo.getDate() - 6) // Include today
    
    const { data, error } = await supabase
      .from('checkins')
      .select('checked_at')
      .eq('user_id', user.id)
      .gte('checked_at', weekAgo.toISOString())
      .order('checked_at', { ascending: true })

    return { data, error }
  }
}
