import React, { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, ExternalLink, Calendar, BookOpen, X, Upload, CheckCircle, Loader } from 'lucide-react'
import { API_ENDPOINTS } from '../../config/api'

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

interface ResearchForm {
  title: string
  description: string
  source_url: string
}

const ResearchManagement: React.FC = () => {
  const [researches, setResearches] = useState<Research[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingResearch, setEditingResearch] = useState<Research | null>(null)
  const [formData, setFormData] = useState<ResearchForm>({
    title: '',
    description: '',
    source_url: ''
  })
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null)
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadSuccess, setUploadSuccess] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [toastType, setToastType] = useState<'success' | 'error'>('success')

  const perPage = 10

  useEffect(() => {
    loadResearches()
  }, [currentPage])

  const loadResearches = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const token = localStorage.getItem('access_token')
      const response = await fetch(`${API_ENDPOINTS.ADMIN_RESEARCHES}?page=${currentPage}&per_page=${perPage}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      
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
    }
  }

  const handleAddResearch = () => {
    setFormData({ title: '', description: '', source_url: '' })
    setThumbnailFile(null)
    setThumbnailUrl(null)
    setUploadSuccess(false)
    setIsModalOpen(true)
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setThumbnailFile(file)
      setThumbnailUrl(null)
      setUploadSuccess(false)
    }
  }

  const handleUploadToS3 = async () => {
    if (!thumbnailFile) {
      showToastMessage('Please select a file first', 'error')
      return
    }

    try {
      setIsUploading(true)
      setUploadSuccess(false)

      const formData = new FormData()
      formData.append('thumbnail_file', thumbnailFile)

      const token = localStorage.getItem('access_token')
      const response = await fetch(`${API_ENDPOINTS.ADMIN_RESEARCHES}/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      })

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.status}`)
      }

      const data = await response.json()
      setThumbnailUrl(data.thumbnail_url)
      setUploadSuccess(true)
      showToastMessage('Image uploaded successfully to S3!', 'success')
    } catch (err) {
      console.error('Error uploading to S3:', err)
      showToastMessage('Failed to upload image to S3', 'error')
    } finally {
      setIsUploading(false)
    }
  }

  const handleEditResearch = (research: Research) => {
    setEditingResearch(research)
    setFormData({
      title: research.title,
      description: research.description,
      source_url: research.source_url
    })
    setThumbnailFile(null)
    setThumbnailUrl(research.thumbnail_url) // Set current thumbnail URL
    setUploadSuccess(true) // Mark as already uploaded
    setIsEditModalOpen(true)
  }

  const handleDeleteResearch = async (researchId: number) => {
    if (!window.confirm('Are you sure you want to delete this research?')) {
      return
    }

    try {
      const token = localStorage.getItem('access_token')
      const response = await fetch(`${API_ENDPOINTS.ADMIN_RESEARCHES}/${researchId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error(`Failed to delete research: ${response.status}`)
      }

      showToastMessage('Research deleted successfully', 'success')
      
      // Check if we need to go back a page (if this was the last item on the current page)
      if (researches.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1)
      } else {
        loadResearches()
      }
    } catch (err) {
      console.error('Error deleting research:', err)
      showToastMessage('Failed to delete research', 'error')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.title.trim() || !formData.description.trim() || !formData.source_url.trim()) {
      showToastMessage('Please fill in all fields', 'error')
      return
    }

    if (!isEditModalOpen && !thumbnailUrl) {
      showToastMessage('Please upload a thumbnail image first', 'error')
      return
    }

    try {
      setIsSubmitting(true)
      const token = localStorage.getItem('access_token')
      
      const requestData = {
        title: formData.title,
        description: formData.description,
        source_url: formData.source_url,
        thumbnail_url: thumbnailUrl || (editingResearch ? editingResearch.thumbnail_url : null)
      }

      const url = isEditModalOpen && editingResearch 
        ? `${API_ENDPOINTS.ADMIN_RESEARCHES}/${editingResearch.id}`
        : API_ENDPOINTS.ADMIN_RESEARCHES
      
      const method = isEditModalOpen ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
      })

      if (!response.ok) {
        throw new Error(`Failed to ${isEditModalOpen ? 'update' : 'create'} research: ${response.status}`)
      }

      showToastMessage(`Research ${isEditModalOpen ? 'updated' : 'created'} successfully`, 'success')
      setIsModalOpen(false)
      setIsEditModalOpen(false)
      setFormData({ title: '', description: '', source_url: '' })
      setThumbnailFile(null)
      setThumbnailUrl(null)
      setUploadSuccess(false)
      setEditingResearch(null)
      loadResearches()
    } catch (err) {
      console.error('Error submitting research:', err)
      showToastMessage(`Failed to ${isEditModalOpen ? 'update' : 'create'} research`, 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const showToastMessage = (message: string, type: 'success' | 'error') => {
    setToastMessage(message)
    setToastType(type)
    setShowToast(true)
    setTimeout(() => setShowToast(false), 3000)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-primary-start/30 border-t-primary-start rounded-full animate-spin"></div>
          <p className="text-gray-600 text-lg">Loading researches...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Research Management</h2>
          <p className="text-gray-600">Manage research articles and studies</p>
        </div>
        <button
          onClick={handleAddResearch}
          className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-primary-start to-primary-end text-white rounded-lg hover:from-primary-end hover:to-primary-start transition-all duration-300"
        >
          <Plus className="w-4 h-4" />
          <span>Add Research</span>
        </button>
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <BookOpen className="w-5 h-5 text-red-500" />
            <p className="text-red-600">{error}</p>
          </div>
        </div>
      )}

      {/* Research List */}
      {researches.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-20 h-20 bg-gradient-to-r from-primary-start/20 to-primary-end/20 rounded-3xl flex items-center justify-center mx-auto mb-4">
            <BookOpen className="w-10 h-10 text-gray-500" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">No Researches Found</h3>
          <p className="text-gray-600">No research articles available at the moment.</p>
        </div>
      ) : (
        <>
          {/* Research Table */}
          <div className="bg-gradient-to-br from-white/80 to-white/60 backdrop-blur-xl rounded-2xl border border-primary-start/20 overflow-hidden shadow-lg">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-br from-primary-start/10 to-primary-end/5 border-b border-primary-start/20">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-800">Thumbnail</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-800">Title</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-800">Description</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-800">Created</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-800">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-800">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-primary-start/10">
                  {researches.map((research) => (
                    <tr key={research.id} className="hover:bg-gradient-to-br from-primary-start/10 to-primary-end/5 transition-colors duration-200">
                      <td className="px-6 py-4">
                        <div className="w-16 h-12 bg-gradient-to-br from-primary-start/20 to-primary-end/20 rounded-lg overflow-hidden">
                          <img
                            src={research.thumbnail_url}
                            alt={research.title}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement
                              const parent = target.parentElement
                              if (parent) {
                                parent.innerHTML = `
                                  <div class="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-start/20 to-primary-end/20">
                                    <svg class="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                    </svg>
                                  </div>
                                `
                              }
                            }}
                          />
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="max-w-xs">
                          <h3 className="text-gray-800 font-medium text-sm line-clamp-2">{research.title}</h3>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="max-w-xs">
                          <p className="text-gray-600 text-sm line-clamp-2">{research.description}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2 text-gray-500 text-sm">
                          <Calendar className="w-4 h-4" />
                          <span>{formatDate(research.created_at)}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          research.is_active
                            ? 'bg-green-100 text-green-800 border border-green-200'
                            : 'bg-red-100 text-red-800 border border-red-200'
                        }`}>
                          {research.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => window.open(research.source_url, '_blank')}
                            className="p-2 text-gray-600 hover:text-gray-800 hover:bg-primary-start/10 rounded-lg transition-all duration-200"
                            title="View Source"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleEditResearch(research)}
                            className="p-2 text-gray-600 hover:text-gray-800 hover:bg-primary-start/10 rounded-lg transition-all duration-200"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteResearch(research.id)}
                            className="p-2 text-red-500 hover:text-red-600 hover:bg-red-500/10 rounded-lg transition-all duration-200"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center space-x-4">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="flex items-center space-x-2 px-4 py-2 bg-white/80 border border-primary-start/20 text-gray-800 rounded-lg hover:bg-primary-start/10 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
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
              </button>
            </div>
          )}

          {/* Results Info */}
          <div className="text-center">
            <p className="text-gray-500 text-sm">
              Showing {((currentPage - 1) * perPage) + 1} to {Math.min(currentPage * perPage, total)} of {total} researches
            </p>
          </div>
        </>
      )}

      {/* Add/Edit Modal */}
      {(isModalOpen || isEditModalOpen) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-gradient-to-br from-white/90 to-white/80 backdrop-blur-xl rounded-2xl border border-primary-start/20 p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-800">
                {isEditModalOpen ? 'Edit Research' : 'Add New Research'}
              </h3>
              <button
                onClick={() => {
                  setIsModalOpen(false)
                  setIsEditModalOpen(false)
                  setFormData({ title: '', description: '', source_url: '' })
                  setThumbnailFile(null)
                  setEditingResearch(null)
                }}
                className="p-2 text-gray-600 hover:text-gray-800 hover:bg-primary-start/10 rounded-lg transition-all duration-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-800 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-3 bg-white/80 border border-primary-start/20 rounded-lg text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-start/50 focus:border-transparent"
                  placeholder="Enter research title"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-800 mb-2">
                  Description *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-3 bg-white/80 border border-primary-start/20 rounded-lg text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-start/50 focus:border-transparent resize-none"
                  placeholder="Enter research description"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-800 mb-2">
                  Source URL *
                </label>
                <input
                  type="url"
                  value={formData.source_url}
                  onChange={(e) => setFormData({ ...formData, source_url: e.target.value })}
                  className="w-full px-4 py-3 bg-white/80 border border-primary-start/20 rounded-lg text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-start/50 focus:border-transparent"
                  placeholder="https://example.com/research"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-800 mb-2">
                  Thumbnail Image {!isEditModalOpen && '*'}
                </label>
                
                {/* File Selection */}
                <div className="relative mb-3">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="w-full px-4 py-3 bg-white/80 border border-primary-start/20 rounded-lg text-gray-800 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-primary-start file:text-white file:cursor-pointer hover:file:bg-primary-end transition-all duration-300"
                  />
                  <Upload className="absolute right-3 top-3 w-5 h-5 text-gray-500 pointer-events-none" />
                </div>

                {/* Upload Button and Status */}
                {thumbnailFile && !uploadSuccess && (
                  <div className="flex items-center space-x-3 mb-3">
                    <button
                      type="button"
                      onClick={handleUploadToS3}
                      disabled={isUploading}
                      className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-primary-start to-primary-end text-white rounded-lg hover:from-primary-end hover:to-primary-start transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isUploading ? (
                        <>
                          <Loader className="w-4 h-4 animate-spin" />
                          <span>Uploading...</span>
                        </>
                      ) : (
                        <>
                          <Upload className="w-4 h-4" />
                          <span>Upload to S3</span>
                        </>
                      )}
                    </button>
                    <span className="text-gray-600 text-sm">
                      {thumbnailFile.name}
                    </span>
                  </div>
                )}

                {/* Success Status */}
                {uploadSuccess && thumbnailUrl && (
                  <div className="flex items-center space-x-2 mb-3 p-3 bg-green-100 border border-green-200 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-green-700 text-sm">Image uploaded successfully to S3!</span>
                  </div>
                )}

                {/* Preview */}
                {thumbnailUrl && (
                  <div className="mb-3">
                    <p className="text-gray-600 text-sm mb-2">Preview:</p>
                    <div className="relative">
                      <img
                        src={thumbnailUrl}
                        alt="Thumbnail preview"
                        className="w-32 h-20 object-cover rounded-lg border border-primary-start/20"
                        onLoad={() => {
                          // Image loaded successfully
                        }}
                        onError={(e) => {
                          console.error('❌ Image failed to load:', thumbnailUrl)
                          const target = e.target as HTMLImageElement
                          const parent = target.parentElement
                          if (parent) {
                            // Show a placeholder instead
                            parent.innerHTML = `
                              <div class="w-32 h-20 bg-gradient-to-br from-primary-start/20 to-primary-end/20 rounded-lg border border-primary-start/20 flex items-center justify-center">
                                <div class="text-center">
                                  <div class="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-1">
                                    <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                    </svg>
                                  </div>
                                  <p class="text-gray-500 text-xs">Image uploaded</p>
                                  <p class="text-gray-400 text-xs">(Preview unavailable)</p>
                                </div>
                              </div>
                            `
                          }
                        }}
                      />
                    </div>
                    <div className="mt-2 p-2 bg-gradient-to-br from-primary-start/10 to-primary-end/5 rounded-lg">
                      <p className="text-gray-600 text-xs mb-1">S3 URL:</p>
                      <p className="text-gray-500 text-xs break-all font-mono">{thumbnailUrl}</p>
                    </div>
                  </div>
                )}

                {isEditModalOpen && (
                  <p className="text-gray-600 text-sm mt-1">
                    Leave empty to keep current thumbnail
                  </p>
                )}
              </div>

              <div className="flex items-center justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false)
                    setIsEditModalOpen(false)
                    setFormData({ title: '', description: '', source_url: '' })
                    setThumbnailFile(null)
                    setEditingResearch(null)
                  }}
                  className="px-6 py-3 bg-white/80 border border-primary-start/20 text-gray-800 rounded-lg hover:bg-primary-start/10 transition-all duration-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-3 bg-gradient-to-r from-primary-start to-primary-end text-white rounded-lg hover:from-primary-end hover:to-primary-start transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Saving...' : (isEditModalOpen ? 'Update Research' : 'Add Research')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Toast */}
      {showToast && (
        <div className="fixed top-4 right-4 z-50">
          <div className={`px-6 py-3 rounded-lg shadow-lg ${
            toastType === 'success' 
              ? 'bg-green-100 border border-green-200 text-green-700' 
              : 'bg-red-100 border border-red-200 text-red-700'
          }`}>
            {toastMessage}
          </div>
        </div>
      )}
    </div>
  )
}

export default ResearchManagement
