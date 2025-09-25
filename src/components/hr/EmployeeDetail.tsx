import React, { useState, useEffect } from 'react'
import { ArrowLeft, User, Hash, Calendar, Activity, FileText, Loader2 } from 'lucide-react'
import { API_ENDPOINTS } from '../../config/api'

interface EmployeeDetailProps {
  employee: {
    id: number
    user_id: number
    employee_code: string
    org_id: string
    hr_email: string
    full_name: string
    email: string
    is_active: boolean
    created_at: string
    updated_at: string
  }
  onBack: () => void
  onStatusUpdate: (employeeId: number, newStatus: boolean) => void
}

interface Assessment {
  id: number
  user_id: number
  assessment_type: string
  assessment_name: string
  total_score: number
  max_score: number
  severity_level: string
  interpretation: string
  responses: any[]
  created_at: string
}

const EmployeeDetail: React.FC<EmployeeDetailProps> = ({ employee, onBack, onStatusUpdate }) => {
  const [assessments, setAssessments] = useState<Assessment[]>([])
  const [isLoadingAssessments, setIsLoadingAssessments] = useState(false)
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchAssessments()
  }, [employee.id])

  const fetchAssessments = async () => {
    try {
      setIsLoadingAssessments(true)
      setError('')

      const token = localStorage.getItem('access_token')
      if (!token) {
        setError('No authentication token found')
        return
      }

      const response = await fetch(`${API_ENDPOINTS.HR_EMPLOYEE_ASSESSMENTS}/${employee.id}/assessments`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setAssessments(data)
      } else {
        const errorData = await response.json()
        setError(errorData.detail || 'Failed to fetch assessments')
      }
    } catch (error) {
      console.error('Error fetching assessments:', error)
      setError('Failed to fetch assessments. Please try again.')
    } finally {
      setIsLoadingAssessments(false)
    }
  }

  const handleStatusToggle = async () => {
    try {
      setIsUpdatingStatus(true)
      setError('')

      const token = localStorage.getItem('access_token')
      if (!token) {
        setError('No authentication token found')
        return
      }

      const newStatus = !employee.is_active
      const response = await fetch(`${API_ENDPOINTS.HR_UPDATE_EMPLOYEE_STATUS}/${employee.id}/status?is_active=${newStatus}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (response.ok) {
        onStatusUpdate(employee.id, newStatus)
      } else {
        const errorData = await response.json()
        setError(errorData.detail || 'Failed to update employee status')
      }
    } catch (error) {
      console.error('Error updating employee status:', error)
      setError('Failed to update employee status. Please try again.')
    } finally {
      setIsUpdatingStatus(false)
    }
  }

  const getSeverityColor = (severity: string) => {
    const level = severity.toLowerCase()
    if (level === 'severe' || level === 'high') {
      return 'bg-red-600 text-black border-red-600'
    } else if (level === 'moderate' || level === 'moderately_severe') {
      return 'bg-yellow-600 text-black border-yellow-600'
    } else {
      return 'bg-green-600 text-black border-green-600'
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

  return (
    <div className="h-screen bg-gradient-to-br from-black via-gray-900 to-black overflow-auto">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-8">
          <button
            onClick={onBack}
            className="p-2 bg-primary-start/10 rounded-lg hover:bg-primary-start/20 transition-colors duration-200"
          >
            <ArrowLeft className="w-5 h-5 text-gray-800" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Employee Details</h1>
            <p className="text-gray-800/70">View and manage employee information</p>
          </div>
        </div>

        {/* Employee Information Card */}
        <div className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl rounded-2xl border border-primary-start/20 p-6 mb-8">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-r from-primary-start to-primary-end rounded-xl flex items-center justify-center">
                <User className="w-8 h-8 text-gray-800" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">{employee.full_name}</h2>
                <p className="text-gray-800/70">{employee.email}</p>
              </div>
            </div>
            
            {/* Status Toggle */}
            <div className="flex items-center space-x-3">
              <span className={`px-3 py-2 rounded-full text-sm font-medium border ${
                employee.is_active
                  ? 'bg-green-600 text-black border-green-600'
                  : 'bg-red-600 text-black border-red-600'
              }`}>
                {employee.is_active ? 'Active' : 'Inactive'}
              </span>
              <button
                onClick={handleStatusToggle}
                disabled={isUpdatingStatus}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  isUpdatingStatus
                    ? 'bg-white/20 text-gray-800/50 cursor-not-allowed'
                    : 'bg-gradient-to-r from-primary-start to-primary-end text-gray-800 hover:from-primary-end hover:to-primary-start'
                }`}
              >
                {isUpdatingStatus ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  `Mark ${employee.is_active ? 'Inactive' : 'Active'}`
                )}
              </button>
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg">
              <p className="text-red-300 text-sm">{error}</p>
            </div>
          )}

          {/* Employee Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Hash className="w-5 h-5 text-gray-800/60" />
                <div>
                  <p className="text-gray-800/70 text-sm">Employee Code</p>
                  <p className="text-gray-800 font-medium">{employee.employee_code}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <User className="w-5 h-5 text-gray-800/60" />
                <div>
                  <p className="text-gray-800/70 text-sm">User ID</p>
                  <p className="text-gray-800 font-medium">{employee.user_id}</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Activity className="w-5 h-5 text-gray-800/60" />
                <div>
                  <p className="text-gray-800/70 text-sm">Organization ID</p>
                  <p className="text-gray-800 font-medium">{employee.org_id}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Calendar className="w-5 h-5 text-gray-800/60" />
                <div>
                  <p className="text-gray-800/70 text-sm">Created</p>
                  <p className="text-gray-800 font-medium">{formatDate(employee.created_at)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Assessment History */}
        <div className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl rounded-2xl border border-primary-start/20 overflow-hidden">
          <div className="p-6 border-b border-primary-start/20">
            <div className="flex items-center space-x-3">
              <FileText className="w-6 h-6 text-gray-800" />
              <div>
                <h3 className="text-xl font-bold text-gray-800">Assessment History</h3>
                <p className="text-gray-800/70">Clinical assessments completed by this employee</p>
              </div>
            </div>
          </div>

          {isLoadingAssessments ? (
            <div className="p-12 text-center">
              <Loader2 className="w-8 h-8 text-gray-800 animate-spin mx-auto mb-4" />
              <p className="text-gray-800/70">Loading assessments...</p>
            </div>
          ) : assessments.length === 0 ? (
            <div className="p-12 text-center">
              <FileText className="w-16 h-16 text-gray-800/30 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">No Assessments Found</h3>
              <p className="text-gray-800/70">This employee hasn't completed any clinical assessments yet.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-br from-primary-start/10 to-primary-end/5 border-b border-primary-start/20">
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-800/80">Assessment</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-800/80">Score</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-800/80">Severity</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-800/80">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {assessments.map((assessment) => (
                    <tr key={assessment.id} className="hover:bg-gradient-to-br from-primary-start/10 to-primary-end/5 transition-colors duration-200">
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-semibold text-gray-800">{assessment.assessment_name}</p>
                          <p className="text-gray-800/60 text-sm">{assessment.assessment_type}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 bg-primary-start/10 border border-white/20 rounded-lg text-gray-800 text-sm font-medium">
                          {assessment.total_score}/{assessment.max_score}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getSeverityColor(assessment.severity_level)}`}>
                          {assessment.severity_level}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-gray-800/80 text-sm">{formatDate(assessment.created_at)}</span>
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

export default EmployeeDetail 