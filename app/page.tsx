import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import LoginButton from './LoginButton'

export default async function LoginPage() {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) {
    redirect('/dashboard')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-lg">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Smart Bookmark
          </h1>
          <p className="text-gray-600">
            Securely store and manage your bookmarks
          </p>
        </div>

        <div className="mt-8">
          <LoginButton />
        </div>

        <p className="text-center text-sm text-gray-500 mt-4">
          Sign in with Google to get started
        </p>
      </div>
    </div>
  )
}
