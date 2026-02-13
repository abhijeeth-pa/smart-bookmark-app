'use client'

import { useState, useEffect } from 'react'

type Bookmark = {
  id: string
  title: string
  url: string
  created_at: string
}

type BookmarkModalProps = {
  isOpen: boolean
  onClose: () => void
  onSubmit: (title: string, url: string) => void
  editingBookmark?: Bookmark | null
}

export default function BookmarkModal({
  isOpen,
  onClose,
  onSubmit,
  editingBookmark,
}: BookmarkModalProps) {
  const [title, setTitle] = useState('')
  const [url, setUrl] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (editingBookmark) {
      setTitle(editingBookmark.title)
      setUrl(editingBookmark.url)
    } else {
      setTitle('')
      setUrl('')
    }
    setError('')
  }, [editingBookmark, isOpen])

  const validateUrl = (urlString: string) => {
    try {
      new URL(urlString)
      return true
    } catch {
      return false
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!title.trim()) {
      setError('Title is required')
      return
    }

    if (!url.trim()) {
      setError('URL is required')
      return
    }

    if (!validateUrl(url)) {
      setError('Please enter a valid URL (e.g., https://example.com)')
      return
    }

    onSubmit(title.trim(), url.trim())
    setTitle('')
    setUrl('')
    onClose()
  }

  const handleClose = () => {
    setTitle('')
    setUrl('')
    setError('')
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 transition-opacity"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-md transform transition-all">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900">
              {editingBookmark ? 'Edit Bookmark' : 'Add New Bookmark'}
            </h2>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {/* Title Input */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Title *
              </label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="My Awesome Website"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-gray-900"
                autoFocus
              />
            </div>

            {/* URL Input */}
            <div>
              <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-2">
                URL *
              </label>
              <input
                id="url"
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-gray-900"
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 px-4 py-3 rounded-lg">
                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {error}
              </div>
            )}

            {/* Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={handleClose}
                className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-lg hover:shadow-xl"
              >
                {editingBookmark ? 'Update' : 'Add Bookmark'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
