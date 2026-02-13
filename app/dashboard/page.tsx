import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import EnhancedDashboard from './EnhancedDashboard'

export default async function DashboardPage() {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/')
  }

  // Fetch initial bookmarks
  const { data: bookmarks } = await supabase
    .from('bookmarks')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  return (
    <EnhancedDashboard 
      initialBookmarks={bookmarks || []} 
      userId={user.id}
      userEmail={user.email || ''}
    />
  )
}
