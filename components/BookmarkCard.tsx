'use client'

import { useState } from 'react'

type Bookmark = {
  id: string
  user_id: string
  title: string
  url: string
  created_at: string
  accessed_at?: string
}

type BookmarkCardProps = {
  bookmark: Bookmark
  onEdit: (bookmark: Bookmark) => void
  onDelete: (id: string) => void
  onAccess: (bookmark: Bookmark) => void
}

export default function BookmarkCard({
  bookmark,
  onEdit,
  onDelete,
  onAccess,
}: BookmarkCardProps) {
  const [showActions, setShowActions] = useState(false)
  const [imageError, setImageError] = useState(false)

  const getDomain = (url: string) => {
    try {
      const urlObj = new URL(url)
      return urlObj.hostname.replace('www.', '')
    } catch {
      return 'Invalid URL'
    }
  }

  const formatTimeAgo = (dateString?: string) => {
    if (!dateString) return 'Never accessed'
    const date = new Date(dateString)
    const now = new Date()
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000)
    
    if (seconds < 60) return 'Accessed just now'
    if (seconds < 3600) return `Accessed ${Math.floor(seconds / 60)}m ago`
    if (seconds < 86400) return `Accessed ${Math.floor(seconds / 3600)}h ago`
    if (seconds < 604800) return `Accessed ${Math.floor(seconds / 86400)}d ago`
    return 'Accessed a while ago'
  }

  const handleCardClick = (e: React.MouseEvent) => {
    // Don't trigger if clicking on action buttons
    if ((e.target as HTMLElement).closest('button')) return
    
    onAccess(bookmark)
    window.open(bookmark.url, '_blank')
  }

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (confirm(`Delete "${bookmark.title}"?`)) {
      onDelete(bookmark.id)
    }
  }

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation()
    onEdit(bookmark)
  }

  return (
    <div
      className="group bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer"
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
      onClick={handleCardClick}
    >
      {/* Thumbnail */}
      <div className="relative h-48 bg-gradient-to-br from-blue-100 to-indigo-100 overflow-hidden">
        {!imageError ? (
          <img
            src={`https://picsum.photos/400/200?random=${bookmark.id}`}
            alt={bookmark.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <svg className="w-16 h-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
          </div>
        )}
        
        {/* Hover Actions */}
        <div
          className={`absolute top-2 right-2 flex gap-2 transition-opacity duration-200 ${
            showActions ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <button
            onClick={handleEdit}
            className="p-2 bg-white rounded-lg shadow-md hover:bg-gray-50 transition-colors"
            title="Edit bookmark"
          >
            <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
            onClick={handleDelete}
            className="p-2 bg-white rounded-lg shadow-md hover:bg-red-50 transition-colors"
            title="Delete bookmark"
          >
            <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
          {bookmark.title}
        </h3>
        
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
          </svg>
          <span className="truncate">{getDomain(bookmark.url)}</span>
        </div>

        <div className="flex items-center gap-2 text-xs text-gray-400">
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{formatTimeAgo(bookmark.accessed_at)}</span>
        </div>
      </div>
    </div>
  )
}
