'use client'

import { supabaseBrowser } from 'lib/supabase-browser'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'

export default function LoginPage() {
  const supabase = supabaseBrowser()

  return (
    <div className="flex justify-center items-center min-h-screen">
      <Auth
        supabaseClient={supabase}
        appearance={{ theme: ThemeSupa }}
        theme="light"
        providers={['google']}
        redirectTo="/wishlist"
      />
    </div>
  )
}
