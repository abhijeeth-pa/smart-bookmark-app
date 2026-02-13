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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 px-4 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl w-full items-center">
        {/* Left Side - Features */}
        <div className="text-white space-y-8 lg:block hidden">
          <div>
            <h2 className="text-5xl font-bold mb-4">Smart Bookmark</h2>
            <p className="text-xl text-blue-100">
              Your personal digital library for all things online
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-blue-400 text-white">
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-1">Save Instantly</h3>
                <p className="text-blue-100">Add and organize bookmarks with a single click</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-blue-400 text-white">
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-1">Find Instantly</h3>
                <p className="text-blue-100">Search through your collection in seconds</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-blue-400 text-white">
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-1">Stay Secure</h3>
                <p className="text-blue-100">Your data is encrypted and always protected</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full max-w-md mx-auto">
          <div className="bg-white rounded-2xl shadow-2xl p-8 space-y-8">
            {/* Logo and Title for Mobile */}
            <div className="lg:hidden text-center mb-4">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                  <span className="text-white text-2xl font-bold">SB</span>
                </div>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-1">Smart Bookmark</h1>
              <p className="text-gray-600">Your digital library</p>
            </div>

            {/* Desktop Logo */}
            <div className="hidden lg:flex items-center justify-center gap-3 mb-2">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-xl font-bold">SB</span>
              </div>
            </div>

            <div className="text-center hidden lg:block">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome Back</h2>
              <p className="text-gray-600 text-sm">Sign in to access your bookmarks</p>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg blur opacity-25"></div>
              <LoginButton />
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-500">
                We use Google for secure, passwordless authentication
              </p>
            </div>

            {/* Trust Badge */}
            <div className="border-t border-gray-200 pt-6">
              <p className="text-center text-xs text-gray-500 mb-4">Trusted by bookmarking enthusiasts</p>
              <div className="flex items-center justify-center gap-2 text-xs text-gray-600">
                <svg className="h-4 w-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>100% Secure & Private</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
