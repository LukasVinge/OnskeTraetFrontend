'use client'

import { supabaseBrowser } from 'lib/supabase-browser'

export default function LogoutPage() {
  const supabase = supabaseBrowser()

  return (
    <button onClick={() => supabase.auth.signOut()}>
      Logout
    </button>
  )
}
