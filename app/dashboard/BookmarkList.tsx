'use client'

import { useState, useEffect, useMemo } from 'react'
import { createClient } from '@/utils/supabase/client'
import Sidebar from '@/components/Sidebar'
import TopNavbar from '@/components/TopNavbar'
import BookmarkGrid from '@/components/BookmarkGrid'
import EmptyState from '@/components/EmptyState'
import BookmarkModal from '@/components/BookmarkModal'
import Toast from '@/components/Toast'
import LoadingSkeleton from '@/components/LoadingSkeleton'
import LogoutButton from './LogoutButton'

type Bookmark = {
  id: string
  user_id: string
  title: string
  url: string
  created_at: string
  accessed_at?: string
}

type EnhancedDashboardProps = {
  initialBookmarks: Bookmark[]
  userId: string
  userEmail: string
}

export default function EnhancedDashboard({
  initialBookmarks,
  userId,
  userEmail,
}: EnhancedDashboardProps) {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>(initialBookmarks)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortOption, setSortOption] = useState('recent')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingBookmark, setEditingBookmark] = useState<Bookmark | null>(null)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info'; isVisible: boolean }>({ message: '', type: 'success', isVisible: false })
  const [isLoading, setIsLoading] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const supabase = createClient()

  // BroadcastChannel for fast cross-tab updates (falls back gracefully)
  useEffect(() => {
    let bc: BroadcastChannel | null = null
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      bc = new BroadcastChannel('bookmarks')
      bc.onmessage = (ev) => {
        try {
          const msg = ev.data
          if (!msg || msg.userId !== userId) return

          if (msg.type === 'added') {
            setBookmarks((current) => [msg.data as Bookmark, ...current])
          }

          if (msg.type === 'deleted') {
            setBookmarks((current) => current.filter((b) => b.id !== msg.id))
          }

          if (msg.type === 'updated') {
            setBookmarks((current) =>
              current.map((b) => (b.id === msg.data.id ? (msg.data as Bookmark) : b))
            )
          }
        } catch (e) {
          // ignore malformed messages
        }
      }
    }

    return () => {
      bc?.close()
    }
  }, [userId])
  // Set up real-time subscription
  useEffect(() => {
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
          setBookmarks((current) => {
            const newItem = payload.new as Bookmark
            // avoid duplicates if the item already exists (e.g., optimistic UI)
            if (current.some((b) => b.id === newItem.id)) return current
            return [newItem, ...current]
          })
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
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'bookmarks',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          setBookmarks((current) =>
            current.map((bookmark) =>
              bookmark.id === payload.new.id ? (payload.new as Bookmark) : bookmark
            )
          )
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase, userId])

  // Filter and sort bookmarks
  const filteredAndSortedBookmarks = useMemo(() => {
    let filtered = bookmarks

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(
        (bookmark) =>
          bookmark.title.toLowerCase().includes(term) ||
          bookmark.url.toLowerCase().includes(term)
      )
    }

    // Sort bookmarks
    const sorted = [...filtered]
    switch (sortOption) {
      case 'recent':
        sorted.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        break
      case 'oldest':
        sorted.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
        break
      case 'title':
        sorted.sort((a, b) => a.title.localeCompare(b.title))
        break
      case 'accessed':
        sorted.sort((a, b) => {
          const aTime = a.accessed_at ? new Date(a.accessed_at).getTime() : 0
          const bTime = b.accessed_at ? new Date(b.accessed_at).getTime() : 0
          return bTime - aTime
        })
        break
    }

    return sorted
  }, [bookmarks, searchTerm, sortOption])

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ message, type, isVisible: true })
  }

  const handleAddBookmark = async (title: string, url: string) => {
    // Create a temporary bookmark object for optimistic update
    const tempBookmark: Bookmark = {
      id: `temp_${Date.now()}`,
      user_id: userId,
      title,
      url,
      created_at: new Date().toISOString(),
    }

    // Immediately update the UI (optimistic update)
    setBookmarks((prev) => [tempBookmark, ...prev])
    setIsModalOpen(false)

    // Perform the database operation
    const { data, error } = await supabase
      .from('bookmarks')
      .insert({
        user_id: userId,
        title,
        url,
      })
      .select()
      .single()

    if (error) {
      // Rollback on error
      setBookmarks((prev) => prev.filter((b) => b.id !== tempBookmark.id))
      showToast('Failed to add bookmark', 'error')
      console.error('Error adding bookmark:', error)
    } else {
      // Replace temp bookmark with real one
      if (data) {
        setBookmarks((prev) => {
          // Remove temp and any existing item with the same real id, then add real item at front
          const filtered = prev.filter((b) => b.id !== tempBookmark.id && b.id !== data.id)
          return [data, ...filtered]
        })
        // Broadcast to other tabs immediately that a bookmark was added
        if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
          const bc = new BroadcastChannel('bookmarks')
          try {
            bc.postMessage({ type: 'added', userId, data })
          } catch (e) {
            // ignore
          }
          bc.close()
        }
      }
      showToast('Bookmark added successfully!', 'success')
    }
  }

  const handleEditBookmark = async (title: string, url: string) => {
    if (!editingBookmark) return

    const originalBookmark = editingBookmark

    // Immediately update the UI (optimistic update)
    setBookmarks((prev) =>
      prev.map((b) =>
        b.id === editingBookmark.id ? { ...b, title, url } : b
      )
    )
    setEditingBookmark(null)
    setIsModalOpen(false)

    // Perform the database operation
    const { error } = await supabase
      .from('bookmarks')
      .update({ title, url })
      .eq('id', editingBookmark.id)

    if (error) {
      // Rollback on error
      setBookmarks((prev) =>
        prev.map((b) => (b.id === originalBookmark.id ? originalBookmark : b))
      )
      showToast('Failed to update bookmark', 'error')
      console.error('Error updating bookmark:', error)
    } else {
      // Broadcast update to other tabs
      if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
        const bc = new BroadcastChannel('bookmarks')
        try {
          bc.postMessage({ type: 'updated', userId, data: { id: editingBookmark.id, title, url } })
        } catch (e) {
          // ignore
        }
        bc.close()
      }
      showToast('Bookmark updated successfully!', 'success')
    }
  }

  const handleDeleteBookmark = async (id: string) => {
    // Store the bookmark in case we need to rollback
    const deletedBookmark = bookmarks.find((b) => b.id === id)

    // Immediately update the UI (optimistic update)
    setBookmarks((prev) => prev.filter((b) => b.id !== id))

    // Perform the database operation
    const { error } = await supabase.from('bookmarks').delete().eq('id', id)

    if (error) {
      // Rollback on error
      if (deletedBookmark) {
        setBookmarks((prev) => [deletedBookmark, ...prev])
      }
      showToast('Failed to delete bookmark', 'error')
      console.error('Error deleting bookmark:', error)
    } else {
      // Broadcast deletion to other tabs
      if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
        const bc = new BroadcastChannel('bookmarks')
        try {
          bc.postMessage({ type: 'deleted', userId, id })
        } catch (e) {
          // ignore
        }
        bc.close()
      }
      showToast('Bookmark deleted', 'info')
    }
  }

  const handleAccessBookmark = (bookmark: Bookmark) => {
    // Update accessed_at timestamp
    supabase
      .from('bookmarks')
      .update({ accessed_at: new Date().toISOString() })
      .eq('id', bookmark.id)
      .then()

    // Store in recent activity
    const recent = JSON.parse(localStorage.getItem(`recent_${userId}`) || '[]')
    const updated = [
      { ...bookmark, accessed_at: new Date().toISOString() },
      ...recent.filter((b: Bookmark) => b.id !== bookmark.id),
    ].slice(0, 5)
    localStorage.setItem(`recent_${userId}`, JSON.stringify(updated))
  }

  const handleOpenAddModal = () => {
    setEditingBookmark(null)
    setIsModalOpen(true)
  }

  const handleOpenEditModal = (bookmark: Bookmark) => {
    setEditingBookmark(bookmark)
    setIsModalOpen(true)
  }

  const handleModalSubmit = (title: string, url: string) => {
    if (editingBookmark) {
      handleEditBookmark(title, url)
    } else {
      handleAddBookmark(title, url)
    }
  }

  const getFirstName = (email: string) => {
    return email.split('@')[0].split('.')[0]
  }

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <Sidebar userId={userId} isMobileOpen={isMobileOpen} setIsMobileOpen={setIsMobileOpen} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navbar */}
        <TopNavbar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          sortOption={sortOption}
          setSortOption={setSortOption}
          onAddBookmark={handleOpenAddModal}
          onToggleSidebar={() => setIsMobileOpen(!isMobileOpen)}
        />

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-6 py-8">
            {/* Welcome Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
                  Welcome back, {getFirstName(userEmail)}! 👋
                </h1>
                <p className="text-gray-600">
                  {bookmarks.length > 0
                    ? `You have ${bookmarks.length} bookmark${bookmarks.length !== 1 ? 's' : ''} saved`
                    : 'Start building your collection'}
                </p>
              </div>
              <LogoutButton />
            </div>

            {/* Bookmarks Grid or Empty State */}
            {isLoading && bookmarks.length === 0 ? (
              <LoadingSkeleton />
            ) : filteredAndSortedBookmarks.length > 0 ? (
              <BookmarkGrid
                bookmarks={filteredAndSortedBookmarks}
                onEdit={handleOpenEditModal}
                onDelete={handleDeleteBookmark}
                onAccess={handleAccessBookmark}
              />
            ) : searchTerm ? (
              <div className="text-center py-16">
                <svg className="w-24 h-24 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No bookmarks found
                </h3>
                <p className="text-gray-500">
                  Try adjusting your search term
                </p>
              </div>
            ) : (
              <EmptyState onAddBookmark={handleOpenAddModal} />
            )}
          </div>
        </main>
      </div>

      {/* Modals and Notifications */}
      <BookmarkModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setEditingBookmark(null)
        }}
        onSubmit={handleModalSubmit}
        editingBookmark={editingBookmark}
      />

      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={() => setToast({ ...toast, isVisible: false })}
      />
    </div>
  )
}
