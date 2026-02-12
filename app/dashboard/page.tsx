import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import LogoutButton from './LogoutButton'
import BookmarkList from './BookmarkList'
import AddBookmarkForm from './AddBookmarkForm'

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
              My Bookmarks
            </h1>
            <p className="text-gray-600 mt-1">
              {user.email}
            </p>
          </div>
          <LogoutButton />
        </header>

        <div className="mb-8">
          <AddBookmarkForm userId={user.id} />
        </div>

        <BookmarkList initialBookmarks={bookmarks || []} userId={user.id} />
      </div>
    </div>
  )
}
