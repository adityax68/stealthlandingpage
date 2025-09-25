import React, { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, ExternalLink, BookOpen } from 'lucide-react'
import { API_ENDPOINTS } from '../config/api'

interface Research {
  id: number
  title: string
  description: string
  thumbnail_url: string
  source_url: string
  is_active: boolean
  created_at: string
  updated_at?: string
}

interface ResearchListResponse {
  researches: Research[]
  total: number
  page: number
  per_page: number
  total_pages: number
}

const ResearchesPage: React.FC = () => {
  const [researches, setResearches] = useState<Research[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)
  const [error, setError] = useState<string | null>(null)

  const perPage = 9 // 3x3 grid

  useEffect(() => {
    loadResearches()
  }, [currentPage])

  const loadResearches = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch(`${API_ENDPOINTS.RESEARCHES}?page=${currentPage}&per_page=${perPage}`)
      
      if (!response.ok) {
        throw new Error(`Failed to load researches: ${response.status}`)
      }
      
      const data: ResearchListResponse = await response.json()
      setResearches(data.researches)
      setTotalPages(data.total_pages)
      setTotal(data.total)
    } catch (err) {
      console.error('Error loading researches:', err)
      setError(err instanceof Error ? err.message : 'Failed to load researches')
    } finally {
      setLoading(false)
    }
  }

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handleReadResearch = (sourceUrl: string) => {
    window.open(sourceUrl, '_blank', 'noopener,noreferrer')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-gray-100 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-primary-start/30 border-t-primary-start rounded-full animate-spin"></div>
          <p className="text-gray-600 text-lg">Loading researches...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 bg-red-500/20 rounded-3xl flex items-center justify-center mx-auto mb-4">
            <BookOpen className="w-10 h-10 text-red-500" />
          </div>
          <h3 className="text-2xl font-semibold text-gray-800 mb-3">Error Loading Researches</h3>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={loadResearches}
            className="px-6 py-3 bg-gradient-to-r from-primary-start to-primary-end text-white rounded-xl hover:from-primary-end hover:to-primary-start transition-all duration-300 font-semibold"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-gray-100">
      {/* Header */}
      <div className="pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6">
            <span className="gradient-text">Research & Studies</span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
            Explore the latest research and studies in mental health, psychology, and wellness.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {researches.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-gradient-to-r from-primary-start/20 to-primary-end/20 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <BookOpen className="w-10 h-10 text-gray-500" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-800 mb-3">No Researches Available</h3>
            <p className="text-gray-600">Check back later for new research content.</p>
          </div>
        ) : (
          <>
            {/* Research Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {researches.map((research) => (
                <div
                  key={research.id}
                  className="bg-gradient-to-br from-white/80 to-white/60 backdrop-blur-xl rounded-2xl border border-primary-start/20 overflow-hidden hover:border-primary-start/40 transition-all duration-300 group shadow-lg hover:shadow-xl"
                >
                  {/* Thumbnail */}
                  <div className="aspect-video bg-gradient-to-br from-primary-start/20 to-primary-end/20 relative overflow-hidden">
                    <img
                      src={research.thumbnail_url}
                      alt={research.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.style.display = 'none'
                        target.nextElementSibling?.classList.remove('hidden')
                      }}
                    />
                    <div className="hidden absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary-start/20 to-primary-end/20">
                      <BookOpen className="w-12 h-12 text-gray-500" />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-800 mb-3 line-clamp-2">
                      {research.title}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">
                      {research.description}
                    </p>

                    {/* Read Button */}
                    <button
                      onClick={() => handleReadResearch(research.source_url)}
                      className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-primary-start/20 to-primary-end/20 border border-primary-start/30 text-gray-800 rounded-lg hover:from-primary-start/30 hover:to-primary-end/30 hover:text-white transition-all duration-300 group"
                    >
                      <span className="font-medium">Read Research</span>
                      <ExternalLink className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center space-x-4">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="flex items-center space-x-2 px-4 py-2 bg-white/80 border border-primary-start/20 text-gray-800 rounded-lg hover:bg-primary-start/10 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Previous</span>
                </button>

                <div className="flex items-center space-x-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-3 py-2 rounded-lg transition-all duration-300 ${
                        page === currentPage
                          ? 'bg-gradient-to-r from-primary-start to-primary-end text-white'
                          : 'bg-white/80 border border-primary-start/20 text-gray-800 hover:bg-primary-start/10'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="flex items-center space-x-2 px-4 py-2 bg-white/80 border border-primary-start/20 text-gray-800 rounded-lg hover:bg-primary-start/10 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span>Next</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Results Info */}
            <div className="text-center mt-8">
              <p className="text-gray-500 text-sm">
                Showing {((currentPage - 1) * perPage) + 1} to {Math.min(currentPage * perPage, total)} of {total} researches
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default ResearchesPage
