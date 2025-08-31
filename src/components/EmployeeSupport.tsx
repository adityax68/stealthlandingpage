import React, { useState, useEffect } from 'react'
import { FileText, AlertCircle, CheckCircle, Clock, Send, Loader2 } from 'lucide-react'
import { API_ENDPOINTS } from '../config/api'
import { useToast } from '../contexts/ToastContext'

interface Complaint {
  id: number
  user_id: number
  employee_id: number
  complaint_text: string
  status: string
  hr_notes: string | null
  created_at: string
  updated_at: string
}

const EmployeeSupport: React.FC = () => {
  const [complaints, setComplaints] = useState<Complaint[]>([])
  const [newComplaint, setNewComplaint] = useState('')
  const [shareEmployeeId, setShareEmployeeId] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const { showToast } = useToast()

  useEffect(() => {
    fetchComplaints()
  }, [])

  const fetchComplaints = async () => {
    try {
      setIsLoading(true)
      setError('')

      const token = localStorage.getItem('token')
      if (!token) {
        setError('No authentication token found')
        return
      }

      const response = await fetch(API_ENDPOINTS.COMPLAINTS_MY_COMPLAINTS, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setComplaints(data)
      } else {
        const errorData = await response.json()
        setError(errorData.detail || 'Failed to fetch complaints')
      }
    } catch (error) {
      console.error('Error fetching complaints:', error)
      setError('Failed to fetch complaints. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmitComplaint = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!newComplaint.trim()) {
      showToast('Please enter your complaint text', 'error')
      return
    }

    try {
      setIsSubmitting(true)
      setError('')

      const token = localStorage.getItem('token')
      if (!token) {
        setError('No authentication token found')
        return
      }

      const response = await fetch(API_ENDPOINTS.COMPLAINTS_CREATE, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          complaint_text: newComplaint.trim(),
          share_employee_id: shareEmployeeId
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setComplaints(prev => [data, ...prev])
        setNewComplaint('')
        showToast('Complaint reported successfully!', 'success')
      } else {
        const errorData = await response.json()
        setError(errorData.detail || 'Failed to submit complaint')
        showToast('Failed to submit complaint', 'error')
      }
    } catch (error) {
      console.error('Error submitting complaint:', error)
      setError('Failed to submit complaint. Please try again.')
      showToast('Failed to submit complaint', 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'resolved':
        return <CheckCircle className="w-5 h-5 text-green-400" />
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-400" />
      default:
        return <AlertCircle className="w-5 h-5 text-blue-400" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'resolved':
        return 'bg-green-500/20 text-green-300 border-green-500/30'
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30'
      default:
        return 'bg-blue-500/20 text-blue-300 border-blue-500/30'
    }
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

  if (isLoading) {
    return (
      <div className="h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-white animate-spin mx-auto mb-4" />
          <p className="text-white/70">Loading complaints...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen bg-gradient-to-br from-black via-gray-900 to-black overflow-auto">
      <div className="p-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">Employee Support</h1>
          <p className="text-white/70">Report workplace concerns and track their status</p>
        </div>

        {/* Submit New Complaint */}
        <div className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl rounded-2xl border border-white/10 p-6 mb-8">
          <div className="flex items-center space-x-3 mb-6">
            <AlertCircle className="w-6 h-6 text-white" />
            <div>
              <h2 className="text-xl font-bold text-white">Report a Concern</h2>
              <p className="text-white/70">Share any workplace issues, harassment concerns, or work pressure</p>
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg">
              <p className="text-red-300 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmitComplaint} className="space-y-4">
            <div>
              <label htmlFor="complaint" className="block text-sm font-medium text-white/80 mb-2">
                Describe your concern
              </label>
              <textarea
                id="complaint"
                value={newComplaint}
                onChange={(e) => setNewComplaint(e.target.value)}
                placeholder="Please describe your concern in detail..."
                className="w-full h-32 px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-primary-start focus:border-transparent resize-none"
                disabled={isSubmitting}
              />
            </div>
            
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="shareEmployeeId"
                checked={shareEmployeeId}
                onChange={(e) => setShareEmployeeId(e.target.checked)}
                className="w-4 h-4 text-primary-start bg-white/5 border-white/20 rounded focus:ring-primary-start focus:ring-2"
              />
              <label htmlFor="shareEmployeeId" className="text-sm text-white/80">
                Share my employee ID with HR (uncheck for anonymous report)
              </label>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || !newComplaint.trim()}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 ${
                isSubmitting || !newComplaint.trim()
                  ? 'bg-white/20 text-white/50 cursor-not-allowed'
                  : 'bg-gradient-to-r from-primary-start to-primary-end text-white hover:from-primary-end hover:to-primary-start'
              }`}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Submit Report</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Complaints List */}
        <div className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden">
          <div className="p-6 border-b border-white/10">
            <div className="flex items-center space-x-3">
              <FileText className="w-6 h-6 text-white" />
              <div>
                <h3 className="text-xl font-bold text-white">Your Reports</h3>
                <p className="text-white/70">Track the status of your submitted concerns</p>
              </div>
            </div>
          </div>

          {complaints.length === 0 ? (
            <div className="p-12 text-center">
              <FileText className="w-16 h-16 text-white/30 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No Reports Yet</h3>
              <p className="text-white/70">Submit your first concern using the form above</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-white/5 border-b border-white/10">
                    <th className="px-6 py-4 text-left text-sm font-semibold text-white/80">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-white/80">Report</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-white/80">Type</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-white/80">Date</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-white/80">HR Response</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {complaints.map((complaint) => (
                    <tr key={complaint.id} className="hover:bg-white/5 transition-colors duration-200">
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(complaint.status)}
                          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(complaint.status)}`}>
                            {complaint.status.charAt(0).toUpperCase() + complaint.status.slice(1)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="max-w-md">
                          <p className="text-white text-sm leading-relaxed">{complaint.complaint_text}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-white/80 text-sm">
                          {complaint.employee_id ? 'Identified' : 'Anonymous'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-white/80 text-sm">{formatDate(complaint.created_at)}</span>
                      </td>
                      <td className="px-6 py-4">
                        {complaint.hr_notes ? (
                          <div className="max-w-md">
                            <p className="text-white/80 text-sm leading-relaxed">{complaint.hr_notes}</p>
                          </div>
                        ) : (
                          <span className="text-white/40 text-sm">No response yet</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default EmployeeSupport 