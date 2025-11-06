'use client'

import { supabaseBrowser } from '@/lib/supabase-browser'

export default function LoginPage() {
  const supabase = supabaseBrowser()

  const login = async () => {
    const { error } = await supabase.auth.signInWithOtp({
      email: 'test@example.com',
    })
    console.log(error)
  }

  return (
    <button onClick={login}>
      Login with Magic Link
    </button>
  )
}
