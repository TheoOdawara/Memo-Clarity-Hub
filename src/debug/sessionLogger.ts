import { supabase } from '@local/supabase/client'

let unsub: (() => void) | null = null

export function startSessionLogging() {
  console.info('[sessionLogger] start')

  // Log current session once
  supabase.auth.getSession().then(({ data, error }) => {
    if (error) console.error('[sessionLogger] getSession error', error)
    console.info('[sessionLogger] current session', data)
  })

  // Subscribe to auth changes
  const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
    console.info('[sessionLogger] auth event', event)
    console.info('[sessionLogger] session', session)
  })

  unsub = () => subscription.unsubscribe()
}

export function stopSessionLogging() {
  if (unsub) {
    unsub()
    unsub = null
    console.info('[sessionLogger] stopped')
  }
}
