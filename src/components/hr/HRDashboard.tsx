import React, { useState, useEffect } from 'react'
import { Users, User, Mail, Building, Calendar, Loader2 } from 'lucide-react'
import { API_ENDPOINTS } from '../../config/api'

interface HRDashboardProps {
  user: any
}

interface Employee {
  id: number
  user_id: number
  employee_code: string
  org_id: string
  hr_email: string
  full_name: string
  email: string
  department?: string
  position?: string
  hire_date?: string
  is_active: boolean
  created_at: string
  updated_at: string
}

const HRDashboard: React.FC<HRDashboardProps> = ({ user }) => {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchEmployees()
  }, [])

  const fetchEmployees = async () => {
    try {
      setIsLoading(true)
      setError('')

      const token = localStorage.getItem('token')
      if (!token) {
        setError('No authentication token found')
        return
      }

      const response = await fetch(API_ENDPOINTS.HR_EMPLOYEES, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setEmployees(data)
      } else {
        const errorData = await response.json()
        setError(errorData.detail || 'Failed to fetch employees')
      }
    } catch (error) {
      console.error('Error fetching employees:', error)
      setError('Failed to fetch employees. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  if (isLoading) {
    return (
      <div className="h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-white animate-spin mx-auto mb-4" />
          <p className="text-white/70">Loading employees...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Error</h1>
          <p className="text-red-400 mb-4">{error}</p>
          <button
            onClick={fetchEmployees}
            className="px-4 py-2 bg-gradient-to-r from-primary-start to-primary-end text-white rounded-lg hover:from-primary-end hover:to-primary-start transition-all duration-300"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen bg-gradient-to-br from-black via-gray-900 to-black overflow-auto">
      <div className="p-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">HR Dashboard</h1>
          <p className="text-white/70">Manage your organization's employees</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-primary-start/10 to-primary-end/10 backdrop-blur-xl rounded-xl p-6 border border-white/10">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-primary-start to-primary-end rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-white/70 text-sm">Total Employees</p>
                <p className="text-2xl font-bold text-white">{employees.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-500/10 to-green-600/10 backdrop-blur-xl rounded-xl p-6 border border-white/10">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-white/70 text-sm">Active Employees</p>
                <p className="text-2xl font-bold text-white">
                  {employees.filter(emp => emp.is_active).length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 backdrop-blur-xl rounded-xl p-6 border border-white/10">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                <Building className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-white/70 text-sm">Organization</p>
                <p className="text-lg font-bold text-white">
                  {employees.length > 0 ? employees[0].org_id : 'N/A'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Employee List */}
        <div className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden">
          <div className="p-6 border-b border-white/10">
            <h2 className="text-2xl font-bold text-white">Employee List</h2>
            <p className="text-white/70 mt-1">All employees under your management</p>
          </div>

          {employees.length === 0 ? (
            <div className="p-12 text-center">
              <Users className="w-16 h-16 text-white/30 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No Employees Found</h3>
              <p className="text-white/70">No employees have been assigned to your organization yet.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              {/* Desktop Table */}
              <div className="hidden lg:block">
                <table className="w-full">
                  <thead>
                    <tr className="bg-white/5 border-b border-white/10">
                      <th className="px-6 py-4 text-left text-sm font-semibold text-white/80">Employee</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-white/80">Code</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-white/80">Email</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-white/80">Department</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-white/80">Position</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-white/80">Joined</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-white/80">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    {employees.map((employee) => (
                      <tr key={employee.id} className="hover:bg-white/5 transition-colors duration-200">
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-r from-primary-start to-primary-end rounded-lg flex items-center justify-center">
                              <User className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <p className="font-semibold text-white">{employee.full_name}</p>
                              <p className="text-white/60 text-sm">ID: {employee.user_id}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-3 py-1 bg-white/10 border border-white/20 rounded-lg text-white text-sm font-medium">
                            {employee.employee_code}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2">
                            <Mail className="w-4 h-4 text-white/60" />
                            <span className="text-white">{employee.email}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-white/80">
                            {employee.department || 'Not specified'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-white/80">
                            {employee.position || 'Not specified'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2">
                            <Calendar className="w-4 h-4 text-white/60" />
                            <span className="text-white/80">
                              {employee.hire_date ? formatDate(employee.hire_date) : 'Not specified'}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${
                            employee.is_active
                              ? 'bg-green-500/20 text-green-300 border-green-500/30'
                              : 'bg-red-500/20 text-red-300 border-red-500/30'
                          }`}>
                            {employee.is_active ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="lg:hidden p-4 space-y-4">
                {employees.map((employee) => (
                  <div key={employee.id} className="bg-white/5 rounded-xl p-4 border border-white/10">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-primary-start to-primary-end rounded-lg flex items-center justify-center">
                        <User className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-white">{employee.full_name}</h3>
                        <p className="text-white/60 text-sm">{employee.employee_code}</p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${
                        employee.is_active
                          ? 'bg-green-500/20 text-green-300 border-green-500/30'
                          : 'bg-red-500/20 text-red-300 border-red-500/30'
                      }`}>
                        {employee.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center space-x-2">
                        <Mail className="w-4 h-4 text-white/60" />
                        <span className="text-white/80">{employee.email}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Building className="w-4 h-4 text-white/60" />
                        <span className="text-white/80">
                          {employee.department || 'Not specified'}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <User className="w-4 h-4 text-white/60" />
                        <span className="text-white/80">
                          {employee.position || 'Not specified'}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-white/60" />
                        <span className="text-white/80">
                          {employee.hire_date ? formatDate(employee.hire_date) : 'Not specified'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default HRDashboard 