import { supabaseServer } from '@/lib/supabase-server'

export default async function DashboardPage() {
  const supabase = supabaseServer()
  const { data: { user } } = await supabase.auth.getUser()

  return <div>Welcome {user?.email}</div>
}
