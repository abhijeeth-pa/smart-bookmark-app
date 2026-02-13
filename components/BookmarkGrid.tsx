'use client'

import BookmarkCard from './BookmarkCard'

type Bookmark = {
  id: string
  title: string
  url: string
  created_at: string
  accessed_at?: string
}

type BookmarkGridProps = {
  bookmarks: Bookmark[]
  onEdit: (bookmark: Bookmark) => void
  onDelete: (id: string) => void
  onAccess: (bookmark: Bookmark) => void
}

export default function BookmarkGrid({
  bookmarks,
  onEdit,
  onDelete,
  onAccess,
}: BookmarkGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {bookmarks.map((bookmark) => (
        <BookmarkCard
          key={bookmark.id}
          bookmark={bookmark}
          onEdit={onEdit}
          onDelete={onDelete}
          onAccess={onAccess}
        />
      ))}
    </div>
  )
}
