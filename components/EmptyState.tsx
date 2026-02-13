'use client'

type EmptyStateProps = {
  onAddBookmark: () => void
}

export default function EmptyState({ onAddBookmark }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="w-64 h-64 mb-8 relative">
        <svg
          className="w-full h-full text-gray-300"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M12 8v4m0 4h.01"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-32 h-32 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full opacity-50 animate-pulse" />
        </div>
      </div>

      <h3 className="text-2xl font-bold text-gray-900 mb-2">
        No bookmarks yet
      </h3>
      <p className="text-gray-500 mb-8 text-center max-w-md">
        Start building your digital library by adding your first bookmark. 
        Save websites, articles, and resources you want to remember.
      </p>

      <button
        onClick={onAddBookmark}
        className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-lg hover:shadow-xl"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        Add Your First Bookmark
      </button>

      <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto mb-3 bg-blue-100 rounded-full flex items-center justify-center">
            <span className="text-2xl">🔖</span>
          </div>
          <h4 className="font-medium text-gray-900 mb-1">Save Websites</h4>
          <p className="text-sm text-gray-500">Store your favorite sites</p>
        </div>
        <div className="text-center">
          <div className="w-12 h-12 mx-auto mb-3 bg-indigo-100 rounded-full flex items-center justify-center">
            <span className="text-2xl">⚡</span>
          </div>
          <h4 className="font-medium text-gray-900 mb-1">Quick Access</h4>
          <p className="text-sm text-gray-500">Find them instantly</p>
        </div>
        <div className="text-center">
          <div className="w-12 h-12 mx-auto mb-3 bg-purple-100 rounded-full flex items-center justify-center">
            <span className="text-2xl">🔄</span>
          </div>
          <h4 className="font-medium text-gray-900 mb-1">Sync Everywhere</h4>
          <p className="text-sm text-gray-500">Real-time updates</p>
        </div>
      </div>
    </div>
  )
}
