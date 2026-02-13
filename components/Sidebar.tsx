'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'

type RecentBookmark = {
  id: string
  title: string
  url: string
  accessed_at?: string
}

export default function Sidebar({ userId, isMobileOpen, setIsMobileOpen }: { userId: string; isMobileOpen: boolean; setIsMobileOpen: (open: boolean) => void }) {
  const pathname = usePathname()
  const [recentBookmarks, setRecentBookmarks] = useState<RecentBookmark[]>([])

  useEffect(() => {
    // Load recent bookmarks from localStorage
    const stored = localStorage.getItem(`recent_${userId}`)
    if (stored) {
      setRecentBookmarks(JSON.parse(stored).slice(0, 5))
    }
  }, [userId])

  const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: '📊' },
    { name: 'My Bookmarks', href: '/dashboard', icon: '🔖' },
  ]

  const formatTimeAgo = (dateString?: string) => {
    if (!dateString) return 'Never'
    const date = new Date(dateString)
    const now = new Date()
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000)
    
    if (seconds < 60) return 'Just now'
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
    return `${Math.floor(seconds / 86400)}d ago`
  }

  return (
    <>
      {/* Overlay */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:sticky top-0 left-0 h-screen w-64 bg-white border-r border-gray-200 
          transform transition-transform duration-300 z-40 overflow-y-auto
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <div className="p-6">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-xl font-bold">SB</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Smart Bookmark</h1>
              <p className="text-xs text-gray-500">Your digital library</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="space-y-1 mb-8">
            {navItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileOpen(false)}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-lg transition-all
                    ${isActive 
                      ? 'bg-blue-50 text-blue-600 font-medium' 
                      : 'text-gray-700 hover:bg-gray-50'
                    }
                  `}
                >
                  <span className="text-xl">{item.icon}</span>
                  <span>{item.name}</span>
                </Link>
              )
            })}
          </nav>

          {/* Recent Activity */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-4 px-4">
              Recent Activity
            </h3>
            {recentBookmarks.length > 0 ? (
              <div className="space-y-2">
                {recentBookmarks.map((bookmark) => (
                  <a
                    key={bookmark.id}
                    href={bookmark.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors group"
                  >
                    <p className="text-sm font-medium text-gray-900 truncate group-hover:text-blue-600">
                      {bookmark.title}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {formatTimeAgo(bookmark.accessed_at)}
                    </p>
                  </a>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 px-4">No recent activity</p>
            )}
          </div>
        </div>
      </aside>
    </>
  )
}
