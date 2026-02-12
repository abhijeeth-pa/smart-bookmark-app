'use client'

import { createClient } from '@/utils/supabase/client'
import { useEffect, useState } from 'react'

type Bookmark = {
  id: string
  user_id: string
  title: string
  url: string
  created_at: string
}

export default function BookmarkList({
  initialBookmarks,
  userId,
}: {
  initialBookmarks: Bookmark[]
  userId: string
}) {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>(initialBookmarks)
  const supabase = createClient()

  useEffect(() => {
    // Set up real-time subscription
    const channel = supabase
      .channel('bookmarks-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'bookmarks',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          setBookmarks((current) => [payload.new as Bookmark, ...current])
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'bookmarks',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          setBookmarks((current) =>
            current.filter((bookmark) => bookmark.id !== payload.old.id)
          )
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase, userId])

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from('bookmarks').delete().eq('id', id)

    if (error) {
      console.error('Error deleting bookmark:', error)
      alert('Failed to delete bookmark')
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date)
  }

  if (bookmarks.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-xl shadow-md">
        <svg
          className="mx-auto h-12 w-12 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
          />
        </svg>
        <h3 className="mt-4 text-lg font-medium text-gray-900">
          No bookmarks yet
        </h3>
        <p className="mt-2 text-sm text-gray-500">
          Add your first bookmark to get started!
        </p>
      </div>
    )
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-900 mb-4">
        Your Bookmarks ({bookmarks.length})
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {bookmarks.map((bookmark) => (
          <div
            key={bookmark.id}
            className="bg-white rounded-lg shadow-md p-5 hover:shadow-lg transition-shadow"
          >
            <div className="flex flex-col h-full">
              <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                {bookmark.title}
              </h3>
              <a
                href={bookmark.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 text-sm mb-3 truncate"
              >
                {bookmark.url}
              </a>
              <p className="text-xs text-gray-500 mb-4 mt-auto">
                {formatDate(bookmark.created_at)}
              </p>
              <div className="flex gap-2">
                <a
                  href={bookmark.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-center text-sm font-medium"
                >
                  Visit
                </a>
                <button
                  onClick={() => handleDelete(bookmark.id)}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm font-medium"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
