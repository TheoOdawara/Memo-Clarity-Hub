import { supabase } from '@local/supabase/client'

let unsub: (() => void) | null = null

export function startSessionLogging() {
  console.warn('[sessionLogger] start')

  // Log current session once
  supabase.auth.getSession().then(({ data, error }) => {
  if (error) console.error('[sessionLogger] getSession error', error)
  console.warn('[sessionLogger] current session', data)
  })

  // Subscribe to auth changes
  const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
  console.warn('[sessionLogger] auth event', event)
  console.warn('[sessionLogger] session', session)
  })

  unsub = () => subscription.unsubscribe()
}

export function stopSessionLogging() {
  if (unsub) {
    unsub()
    unsub = null
  console.warn('[sessionLogger] stopped')
  }
}
