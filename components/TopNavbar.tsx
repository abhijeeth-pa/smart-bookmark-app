'use client'

import { useState, useEffect } from 'react'

type TopNavbarProps = {
  searchTerm: string
  setSearchTerm: (term: string) => void
  sortOption: string
  setSortOption: (option: string) => void
  onAddBookmark: () => void
}

export default function TopNavbar({
  searchTerm,
  setSearchTerm,
  sortOption,
  setSortOption,
  onAddBookmark,
}: TopNavbarProps) {
  const [localSearch, setLocalSearch] = useState(searchTerm)

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchTerm(localSearch)
    }, 300)

    return () => clearTimeout(timer)
  }, [localSearch, setSearchTerm])

  // Persist sort option to localStorage
  useEffect(() => {
    localStorage.setItem('sortOption', sortOption)
  }, [sortOption])

  // Load sort option from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('sortOption')
    if (stored) {
      setSortOption(stored)
    }
  }, [setSortOption])

  return (
    <div className="bg-white border-b border-gray-200 sticky top-0 z-30">
      <div className="px-6 py-4 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        {/* Search Input */}
        <div className="flex-1 w-full sm:w-auto sm:max-w-md">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg
                className="h-5 w-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <input
              type="text"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              placeholder="Search bookmarks..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
            {localSearch && (
              <button
                onClick={() => setLocalSearch('')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                <svg className="h-5 w-5 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Sort Dropdown & Add Button */}
        <div className="flex gap-3 w-full sm:w-auto">
          {/* Sort Dropdown */}
          <div className="flex-1 sm:flex-initial">
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white cursor-pointer"
            >
              <option value="recent">Recent</option>
              <option value="oldest">Oldest</option>
              <option value="title">Title (A-Z)</option>
              <option value="accessed">Last Accessed</option>
            </select>
          </div>

          {/* Add Bookmark Button */}
          <button
            onClick={onAddBookmark}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium whitespace-nowrap"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span className="hidden sm:inline">Add Bookmark</span>
            <span className="sm:hidden">Add</span>
          </button>
        </div>
      </div>
    </div>
  )
}
