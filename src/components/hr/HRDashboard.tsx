import React, { useState, useEffect } from 'react'
import { Users, User, Mail, Building, Shield, Briefcase, ChevronLeft, ChevronRight, Activity, Target, Globe } from 'lucide-react'
import { API_ENDPOINTS } from '../../config/api'

interface HRDashboardProps {
  user?: {
    id: number
    email: string
    role: string
    [key: string]: unknown
  }
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

const HRDashboard: React.FC<HRDashboardProps> = () => {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const employeesPerPage = 10
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchEmployees()
  }, [])

  // Search effect - only reset page when searching, don't trigger API calls
  useEffect(() => {
    if (searchTerm !== '') {
      setCurrentPage(1) // Reset to first page when searching
    }
  }, [searchTerm])

  // Remove the pagination effect that calls fetchEmployees on page change
  // Since we're using local filtering, we don't need to fetch on page change

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
        const errorData = await response.json().catch(() => ({ detail: 'Unknown error' }))
        setError(`Failed to fetch employees: ${errorData.detail || 'Unknown error'}`)
      }
    } catch (error: unknown) {
      console.error('Error fetching employees:', error)
      const errorMessage = error instanceof Error ? error.message : 'Network error'
      setError(`Failed to fetch employees: ${errorMessage}`)
    } finally {
      setIsLoading(false)
    }
  }



  // Pagination calculations
  const totalPages = Math.ceil(employees.length / employeesPerPage)
  const startIndex = (currentPage - 1) * employeesPerPage
  const endIndex = startIndex + employeesPerPage
  const currentEmployees = employees.slice(startIndex, endIndex)

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)))
  }

  const goToPreviousPage = () => {
    setCurrentPage(prev => Math.max(1, prev - 1))
  }

  const goToNextPage = () => {
    setCurrentPage(prev => Math.min(totalPages, prev + 1))
  }

  // Local search filtering
  const filteredEmployees = employees.filter(employee => 
    searchTerm === '' || 
    employee.employee_code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.email?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Pagination calculations for filtered results
  const filteredTotalPages = Math.ceil(filteredEmployees.length / employeesPerPage)
  const filteredStartIndex = (currentPage - 1) * employeesPerPage
  const filteredEndIndex = filteredStartIndex + employeesPerPage
  const filteredCurrentEmployees = filteredEmployees.slice(filteredStartIndex, filteredEndIndex)

  // Use filtered results when searching, otherwise use paginated results
  const displayEmployees = searchTerm ? filteredCurrentEmployees : currentEmployees
  const displayTotalPages = searchTerm ? filteredTotalPages : totalPages
  const displayStartIndex = searchTerm ? filteredStartIndex : startIndex
  const displayEndIndex = searchTerm ? filteredEndIndex : endIndex
  const displayTotalCount = searchTerm ? filteredEmployees.length : employees.length

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-slate-300 text-lg font-medium">Loading employees...</p>
          <div className="flex items-center justify-center space-x-2">
            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center space-y-6 max-w-md mx-auto">
          <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto">
            <Shield className="w-10 h-10 text-red-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white mb-2">Something went wrong</h1>
            <p className="text-slate-400 mb-6">{error}</p>
          </div>
          <button
            onClick={fetchEmployees}
            className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl hover:from-cyan-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-cyan-500/25"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="relative inline-flex items-center justify-center w-18 h-18 bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-700 rounded-2xl mb-5 shadow-xl shadow-cyan-500/25">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 to-blue-500/20 rounded-2xl blur-lg"></div>
            <Briefcase className="w-9 h-9 text-white relative z-10" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-cyan-100 to-blue-200 bg-clip-text text-transparent mb-3 tracking-tight">
            HR Dashboard
          </h1>
          <p className="text-slate-300 text-base max-w-lg mx-auto leading-relaxed">
            Manage your organization's employees with clear oversight and complete control.
          </p>
        </div>

        {/* Stats Cards - Ultra Professional & Compact */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/8 to-blue-600/8 rounded-xl blur-lg group-hover:blur-xl transition-all duration-500"></div>
            <div className="relative bg-gradient-to-br from-white/8 to-white/4 backdrop-blur-xl rounded-xl p-5 border border-white/15 hover:border-cyan-400/30 transition-all duration-300 hover:transform hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/15">
              <div className="flex items-center justify-between mb-3">
                <div className="w-11 h-11 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center shadow-md shadow-cyan-500/20">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <Activity className="w-4 h-4 text-cyan-400 opacity-70" />
              </div>
              <div>
                <p className="text-slate-300 text-xs font-semibold mb-1 uppercase tracking-wider">Total Employees</p>
                <p className="text-2xl font-bold text-white mb-1">{employees.length}</p>
                <p className="text-slate-400 text-xs">Across all departments</p>
              </div>
            </div>
          </div>

          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/8 to-green-600/8 rounded-xl blur-lg group-hover:blur-xl transition-all duration-500"></div>
            <div className="relative bg-gradient-to-br from-white/8 to-white/4 backdrop-blur-xl rounded-xl p-5 border border-white/15 hover:border-emerald-400/30 transition-all duration-300 hover:transform hover:scale-105 hover:shadow-lg hover:shadow-emerald-500/15">
              <div className="flex items-center justify-between mb-3">
                <div className="w-11 h-11 bg-gradient-to-r from-emerald-500 to-green-600 rounded-lg flex items-center justify-center shadow-md shadow-emerald-500/20">
                  <User className="w-5 h-5 text-white" />
                </div>
                <Target className="w-4 h-4 text-emerald-400 opacity-70" />
              </div>
              <div>
                <p className="text-slate-300 text-xs font-semibold mb-1 uppercase tracking-wider">Active Employees</p>
                <p className="text-2xl font-bold text-white mb-1">
                  {employees.filter(emp => emp.is_active).length}
                </p>
                <p className="text-slate-400 text-xs">Currently employed</p>
              </div>
            </div>
          </div>

          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-r from-violet-500/8 to-purple-600/8 rounded-xl blur-lg group-hover:blur-xl transition-all duration-500"></div>
            <div className="relative bg-gradient-to-br from-white/8 to-white/4 backdrop-blur-xl rounded-xl p-5 border border-white/15 hover:border-violet-400/30 transition-all duration-300 hover:transform hover:scale-105 hover:shadow-lg hover:shadow-violet-500/15">
              <div className="flex items-center justify-between mb-3">
                <div className="w-11 h-11 bg-gradient-to-r from-violet-500 to-purple-600 rounded-lg flex items-center justify-center shadow-md shadow-violet-500/20">
                  <Building className="w-5 h-5 text-white" />
                </div>
                <Globe className="w-4 h-4 text-violet-400 opacity-70" />
              </div>
              <div>
                <p className="text-slate-300 text-xs font-semibold mb-1 uppercase tracking-wider">Organization</p>
                <p className="text-xl font-bold text-white mb-1">
                  {employees.length > 0 ? employees[0].org_id : 'N/A'}
                </p>
                <p className="text-slate-400 text-xs">Your company ID</p>
              </div>
            </div>
          </div>
        </div>

        {/* Employee List */}
        <div className="bg-gradient-to-br from-white/8 to-white/4 backdrop-blur-xl rounded-xl border border-white/15 overflow-hidden shadow-lg">
          <div className="p-5 border-b border-white/15 bg-gradient-to-r from-white/8 to-white/4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white mb-1">Employee List</h2>
                <p className="text-slate-300 text-sm">All employees under your management</p>
              </div>
              <div className="hidden md:flex items-center space-x-2 px-3 py-2 bg-white/8 rounded-lg border border-white/15 backdrop-blur-sm">
                <Users className="w-4 h-4 text-slate-300" />
                <span className="text-white font-semibold text-sm">{displayTotalCount} employees</span>
              </div>
            </div>
            
            {/* Search Bar */}
            <div className="mt-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search by employee code or email..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value)
                    setCurrentPage(1) // Reset to first page when searching
                  }}
                  className="w-full px-4 py-2.5 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-400/50 transition-all duration-200"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {employees.length === 0 ? (
            <div className="p-10 text-center">
              <div className="w-16 h-16 bg-slate-700/50 rounded-full flex items-center justify-center mx-auto mb-3">
                <Users className="w-8 h-8 text-slate-500" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">No Employees Found</h3>
              <p className="text-slate-400 text-sm max-w-sm mx-auto leading-relaxed">
                No employees have been assigned to your organization yet. They will appear here once added.
              </p>
            </div>
          ) : (
            <div className="overflow-hidden">
              {/* Desktop Table */}
              <div className="hidden lg:block">
                <table className="w-full">
                  <thead>
                    <tr className="bg-white/8 border-b border-white/15">
                      <th className="px-5 py-3 text-left text-xs font-bold text-slate-200 uppercase tracking-wider">Employee</th>
                      <th className="px-5 py-3 text-left text-xs font-bold text-slate-200 uppercase tracking-wider">Code</th>
                      <th className="px-5 py-3 text-left text-xs font-bold text-slate-200 uppercase tracking-wider">Email</th>
                      <th className="px-5 py-3 text-left text-xs font-bold text-slate-200 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                                      <tbody className="divide-y divide-white/8">
                      {displayEmployees.map((employee, index) => (
                      <tr 
                        key={employee.id} 
                        className="hover:bg-white/8 transition-all duration-200 group"
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        <td className="px-5 py-3">
                          <div className="flex items-center space-x-3">
                            <div className="w-9 h-9 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center shadow-sm group-hover:shadow-cyan-500/25 transition-all duration-200">
                              <User className="w-4 h-4 text-white" />
                            </div>
                            <div>
                              <p className="font-bold text-white text-sm group-hover:text-cyan-300 transition-colors duration-200">
                                {employee.full_name}
                              </p>
                              <p className="text-slate-400 text-xs">ID: {employee.user_id}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-3">
                          <span className="px-2 py-1 bg-slate-700/50 border border-slate-600/40 rounded-md text-cyan-300 text-xs font-semibold">
                            {employee.employee_code}
                          </span>
                        </td>
                        <td className="px-5 py-3">
                          <div className="flex items-center space-x-2">
                            <Mail className="w-3 h-3 text-slate-400" />
                            <span className="text-white group-hover:text-cyan-300 transition-colors duration-200 font-medium text-xs">
                              {employee.email}
                            </span>
                          </div>
                        </td>
                        <td className="px-5 py-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-bold border transition-all duration-200 ${
                            employee.is_active
                              ? 'bg-emerald-500/25 text-emerald-200 border-emerald-500/40 hover:bg-emerald-500/35'
                              : 'bg-red-500/25 text-red-200 border-red-500/40 hover:bg-red-500/35'
                          }`}>
                            {employee.is_active ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                                  {/* Pagination Controls - Ultra Professional & Compact */}
                  {displayTotalPages > 1 && (
                  <div className="px-5 py-3 border-t border-white/15 bg-gradient-to-r from-white/8 to-white/4">
                    <div className="flex items-center justify-between">
                                              <div className="text-xs text-slate-300 font-medium">
                          Showing {displayStartIndex + 1} to {Math.min(displayEndIndex, displayTotalCount)} of {displayTotalCount} employees
                        </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={goToPreviousPage}
                          disabled={currentPage === 1}
                          className="p-1.5 rounded-md border border-white/20 text-white hover:bg-white/15 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:border-cyan-400/40"
                        >
                          <ChevronLeft className="w-3.5 h-3.5" />
                        </button>
                        
                        <div className="flex items-center space-x-1">
                          {Array.from({ length: Math.min(5, displayTotalPages) }, (_, i) => {
                            let pageNum;
                            if (displayTotalPages <= 5) {
                              pageNum = i + 1;
                            } else if (currentPage <= 3) {
                              pageNum = i + 1;
                            } else if (currentPage >= displayTotalPages - 2) {
                              pageNum = displayTotalPages - 4 + i;
                            } else {
                              pageNum = currentPage - 2 + i;
                            }
                            
                            return (
                              <button
                                key={pageNum}
                                onClick={() => goToPage(pageNum)}
                                className={`px-2.5 py-1.5 rounded-md text-xs font-bold transition-all duration-200 ${
                                  currentPage === pageNum
                                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/20'
                                    : 'text-slate-300 hover:bg-white/15 hover:text-white border border-transparent hover:border-white/20'
                                }`}
                              >
                                {pageNum}
                              </button>
                            );
                          })}
                        </div>

                        <button
                          onClick={goToNextPage}
                          disabled={currentPage === displayTotalPages}
                          className="p-1.5 rounded-md border border-white/20 text-white hover:bg-white/15 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:border-cyan-400/40"
                        >
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Mobile Cards - Ultra Professional & Compact */}
              <div className="lg:hidden p-4 space-y-3">
                {displayEmployees.map((employee, index) => (
                  <div 
                    key={employee.id} 
                    className="bg-gradient-to-br from-white/8 to-white/4 rounded-lg p-4 border border-white/15 hover:border-cyan-400/30 transition-all duration-200 hover:transform hover:scale-[1.005] hover:shadow-md hover:shadow-cyan-500/15"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center shadow-sm">
                        <User className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-white text-sm mb-1">{employee.full_name}</h3>
                        <p className="text-slate-400 text-xs">{employee.employee_code}</p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-bold border ${
                        employee.is_active
                          ? 'bg-emerald-500/25 text-emerald-200 border-emerald-500/40'
                          : 'bg-red-500/25 text-red-200 border-red-500/40'
                      }`}>
                        {employee.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    
                    <div className="space-y-2 text-xs">
                      <div className="flex items-center space-x-2 p-2 bg-slate-800/30 rounded-md border border-white/10">
                        <Mail className="w-3 h-3 text-slate-400" />
                        <span className="text-slate-300 font-medium">{employee.email}</span>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Mobile Pagination - Ultra Professional & Compact */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between pt-3 border-t border-white/15">
                    <button
                      onClick={goToPreviousPage}
                      disabled={currentPage === 1}
                      className="px-3 py-1.5 rounded-md border border-white/20 text-white hover:bg-white/15 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:border-cyan-400/40 font-medium text-xs"
                    >
                      Previous
                    </button>
                    
                    <span className="text-slate-300 font-semibold text-xs">
                      Page {currentPage} of {totalPages}
                    </span>
                    
                    <button
                      onClick={goToNextPage}
                      disabled={currentPage === totalPages}
                      className="px-3 py-1.5 rounded-md border border-white/20 text-white hover:bg-white/15 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:border-cyan-400/40 font-medium text-xs"
                    >
                      Next
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default HRDashboard 