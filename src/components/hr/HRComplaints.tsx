import React, { useState, useEffect } from 'react'
import { AlertCircle, CheckCircle, Clock, User, UserX, Loader2, FileText } from 'lucide-react'
import { API_ENDPOINTS } from '../../config/api'

interface Complaint {
  id: number
  user_id: number
  employee_id: number | null
  complaint_text: string
  status: string
  hr_notes: string | null
  created_at: string
  updated_at: string
}

interface Employee {
  id: number
  full_name: string
  employee_code: string
  email: string
}

const HRComplaints: React.FC = () => {
  const [complaints, setComplaints] = useState<Complaint[]>([])
  const [employees, setEmployees] = useState<Employee[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isResolvingComplaint, setIsResolvingComplaint] = useState<number | null>(null)
  const [error, setError] = useState('')
  const [hrNotes, setHrNotes] = useState('')

  useEffect(() => {
    fetchComplaints()
    fetchEmployees()
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

      const response = await fetch(API_ENDPOINTS.COMPLAINTS_HR_ALL, {
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

  const fetchEmployees = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) return

      const response = await fetch(API_ENDPOINTS.HR_EMPLOYEES, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setEmployees(data)
      }
    } catch (error) {
      console.error('Error fetching employees:', error)
    }
  }

  const handleResolveComplaint = async (complaintId: number) => {
    try {
      setIsResolvingComplaint(complaintId)
      setError('')

      const token = localStorage.getItem('token')
      if (!token) {
        setError('No authentication token found')
        return
      }

      const response = await fetch(`${API_ENDPOINTS.COMPLAINTS_RESOLVE}/${complaintId}/resolve`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: 'resolved',
          hr_notes: hrNotes.trim() || 'Issue has been resolved'
        }),
      })

      if (response.ok) {
        // Update local state
        setComplaints(prev => 
          prev.map(comp => 
            comp.id === complaintId 
              ? { ...comp, status: 'resolved', hr_notes: hrNotes.trim() || 'Issue has been resolved' }
              : comp
          )
        )
        setHrNotes('')
        setError('')
      } else {
        const errorData = await response.json()
        setError(errorData.detail || 'Failed to resolve complaint')
      }
    } catch (error) {
      console.error('Error resolving complaint:', error)
      setError('Failed to resolve complaint. Please try again.')
    } finally {
      setIsResolvingComplaint(null)
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'resolved':
        return <CheckCircle className="w-4 h-4 text-green-400" />
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-400" />
      default:
        return <AlertCircle className="w-4 h-4 text-blue-400" />
    }
  }

  const getEmployeeInfo = (employeeId: number | null) => {
    if (!employeeId) return { name: 'Anonymous', code: 'N/A', email: 'N/A' }
    
    const employee = employees.find(emp => emp.id === employeeId)
    if (!employee) return { name: 'Unknown Employee', code: 'N/A', email: 'N/A' }
    
    return {
      name: employee.full_name,
      code: employee.employee_code,
      email: employee.email
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
          <h1 className="text-4xl font-bold text-white mb-4">HR Complaints Management</h1>
          <p className="text-white/70">Manage workplace concerns and grievances from employees</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-primary-start/10 to-primary-end/10 backdrop-blur-xl rounded-xl p-6 border border-white/10">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-primary-start to-primary-end rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-white/70 text-sm">Total Complaints</p>
                <p className="text-2xl font-bold text-white">{complaints.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-yellow-500/10 to-yellow-600/10 backdrop-blur-xl rounded-xl p-6 border border-white/10">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-white/70 text-sm">Pending</p>
                <p className="text-2xl font-bold text-white">
                  {complaints.filter(comp => comp.status === 'pending').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-500/10 to-green-600/10 backdrop-blur-xl rounded-xl p-6 border border-white/10">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-white/70 text-sm">Resolved</p>
                <p className="text-2xl font-bold text-white">
                  {complaints.filter(comp => comp.status === 'resolved').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-lg">
            <p className="text-red-300 text-sm">{error}</p>
          </div>
        )}

        {/* Complaints List */}
        <div className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden">
          <div className="p-6 border-b border-white/10">
            <div className="flex items-center space-x-3">
              <AlertCircle className="w-6 h-6 text-white" />
              <div>
                <h3 className="text-xl font-bold text-white">All Complaints</h3>
                <p className="text-white/70">Both identified and anonymous workplace concerns</p>
              </div>
            </div>
          </div>

          {complaints.length === 0 ? (
            <div className="p-12 text-center">
              <FileText className="w-16 h-16 text-white/30 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No Complaints Found</h3>
              <p className="text-white/70">No workplace concerns have been reported yet.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-white/5 border-b border-white/10">
                    <th className="px-6 py-4 text-left text-sm font-semibold text-white/80">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-white/80">Employee</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-white/80">Complaint</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-white/80">Date</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-white/80">HR Notes</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-white/80">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {complaints.map((complaint) => {
                    const employeeInfo = getEmployeeInfo(complaint.employee_id)
                    return (
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
                          <div className="flex items-center space-x-2">
                            {complaint.employee_id ? (
                              <User className="w-4 h-4 text-blue-400" />
                            ) : (
                              <UserX className="w-4 h-4 text-gray-400" />
                            )}
                            <div>
                              <p className="font-semibold text-white">{employeeInfo.name}</p>
                              <p className="text-white/60 text-sm">{employeeInfo.code}</p>
                              <p className="text-white/60 text-xs">{employeeInfo.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="max-w-md">
                            <p className="text-white text-sm leading-relaxed">{complaint.complaint_text}</p>
                          </div>
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
                            <span className="text-white/40 text-sm">No notes yet</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          {complaint.status === 'pending' && (
                            <div className="space-y-2">
                              <textarea
                                value={hrNotes}
                                onChange={(e) => setHrNotes(e.target.value)}
                                placeholder="Add HR notes..."
                                className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-primary-start focus:border-transparent resize-none text-sm"
                                rows={2}
                              />
                              <button
                                onClick={() => handleResolveComplaint(complaint.id)}
                                disabled={isResolvingComplaint === complaint.id}
                                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                                  isResolvingComplaint === complaint.id
                                    ? 'bg-white/20 text-white/50 cursor-not-allowed'
                                    : 'bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700'
                                }`}
                              >
                                {isResolvingComplaint === complaint.id ? (
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                  'Resolve'
                                )}
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default HRComplaints 