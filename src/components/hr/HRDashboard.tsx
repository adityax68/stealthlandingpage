import React, { useState, useEffect } from 'react'
import { Users, User, Mail, Loader2, ChevronLeft, ChevronRight, AlertCircle, Upload } from 'lucide-react'
import { API_ENDPOINTS } from '../../config/api'
import EmployeeDetail from './EmployeeDetail'
import HRComplaints from './HRComplaints'
import BulkEmployeeUpload from './BulkEmployeeUpload'

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
  is_active: boolean
  created_at: string
  updated_at: string
}

type HRTab = 'employees' | 'complaints' | 'bulk-upload'

const HRDashboard: React.FC<HRDashboardProps> = ({ user: _user }) => {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null)
  const [activeTab, setActiveTab] = useState<HRTab>('employees')
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [employeesPerPage] = useState(10)

  useEffect(() => {
    fetchEmployees()
  }, [])

  // Calculate pagination values
  const indexOfLastEmployee = currentPage * employeesPerPage
  const indexOfFirstEmployee = indexOfLastEmployee - employeesPerPage
  const currentEmployees = employees.slice(indexOfFirstEmployee, indexOfLastEmployee)
  const totalPages = Math.ceil(employees.length / employeesPerPage)

  // Pagination functions
  const goToPage = (pageNumber: number) => {
    setCurrentPage(pageNumber)
  }

  const goToPreviousPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1))
  }

  const goToNextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages))
  }

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages = []
    const maxVisiblePages = 5
    
    if (totalPages <= maxVisiblePages) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      // Show pages around current page
      let start = Math.max(1, currentPage - 2)
      let end = Math.min(totalPages, start + maxVisiblePages - 1)
      
      // Adjust start if we're near the end
      if (end - start < maxVisiblePages - 1) {
        start = Math.max(1, end - maxVisiblePages + 1)
      }
      
      for (let i = start; i <= end; i++) {
        pages.push(i)
      }
    }
    
    return pages
  }

  const fetchEmployees = async () => {
    try {
      setIsLoading(true)
      setError('')

      const token = localStorage.getItem('access_token')
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

  const handleEmployeeClick = (employee: Employee) => {
    setSelectedEmployee(employee)
  }

  const handleBackToList = () => {
    setSelectedEmployee(null)
  }

  const handleStatusUpdate = (employeeId: number, newStatus: boolean) => {
    setEmployees(prevEmployees => 
      prevEmployees.map(emp => 
        emp.id === employeeId ? { ...emp, is_active: newStatus } : emp
      )
    )
    if (selectedEmployee && selectedEmployee.id === employeeId) {
      setSelectedEmployee(prev => prev ? { ...prev, is_active: newStatus } : null)
    }
  }

  // If an employee is selected, show the detail view
  if (selectedEmployee) {
    return (
      <EmployeeDetail
        employee={selectedEmployee}
        onBack={handleBackToList}
        onStatusUpdate={handleStatusUpdate}
      />
    )
  }

  if (isLoading) {
    return (
      <div className="h-screen bg-gradient-to-br from-white via-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-gray-800 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading employees...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="h-screen bg-gradient-to-br from-white via-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Error</h1>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={fetchEmployees}
            className="px-4 py-2 bg-gradient-to-r from-primary-start to-primary-end text-gray-800 rounded-lg hover:from-primary-end hover:to-primary-start transition-all duration-300"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen bg-gradient-to-br from-white via-gray-50 to-gray-100 overflow-auto">
      <div className="p-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">HR Dashboard</h1>
          <p className="text-gray-800/70">Manage your organization's employees and complaints</p>
          
          {/* Tab Navigation */}
          <div className="flex justify-center mt-6 space-x-2">
            <button
              onClick={() => setActiveTab('employees')}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                activeTab === 'employees'
                  ? 'bg-gradient-to-r from-primary-start to-primary-end text-gray-800'
                  : 'bg-primary-start/10 text-gray-800/70 hover:bg-primary-start/20'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5" />
                <span>Employees</span>
              </div>
            </button>
            
            <button
              onClick={() => setActiveTab('complaints')}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                activeTab === 'complaints'
                  ? 'bg-gradient-to-r from-primary-start to-primary-end text-gray-800'
                  : 'bg-primary-start/10 text-gray-800/70 hover:bg-primary-start/20'
              }`}
            >
              <div className="flex items-center space-x-2">
                <AlertCircle className="w-5 h-5" />
                <span>Complaints</span>
              </div>
            </button>
            
            <button
              onClick={() => setActiveTab('bulk-upload')}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                activeTab === 'bulk-upload'
                  ? 'bg-gradient-to-r from-primary-start to-primary-end text-gray-800'
                  : 'bg-primary-start/10 text-gray-800/70 hover:bg-primary-start/20'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Upload className="w-5 h-5" />
                <span>Bulk Upload</span>
              </div>
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-primary-start/10 to-primary-end/10 backdrop-blur-xl rounded-xl p-6 border border-primary-start/20">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-primary-start to-primary-end rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-gray-800" />
              </div>
              <div>
                <p className="text-gray-800/70 text-sm">Total Employees</p>
                <p className="text-2xl font-bold text-gray-800">{employees.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-500/10 to-green-600/10 backdrop-blur-xl rounded-xl p-6 border border-primary-start/20">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                <User className="w-6 h-6 text-gray-800" />
              </div>
              <div>
                <p className="text-gray-800/70 text-sm">Active Employees</p>
                <p className="text-2xl font-bold text-gray-800">
                  {employees.filter(emp => emp.is_active).length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 backdrop-blur-xl rounded-xl p-6 border border-primary-start/20">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-gray-800" />
              </div>
              <div>
                <p className="text-gray-800/70 text-sm">Organization</p>
                <p className="text-lg font-bold text-gray-800">
                  {employees.length > 0 ? employees[0].org_id : 'N/A'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'employees' ? (
          // Employee List Content
          <div className="bg-gradient-to-br from-white/90 to-white/95 backdrop-blur-xl rounded-2xl border border-primary-start/30 overflow-hidden shadow-lg">
            <div className="p-6 border-b border-primary-start/20 bg-gradient-to-r from-primary-start/5 to-primary-end/5">
              <h2 className="text-2xl font-bold text-gray-800">Employee List</h2>
              <p className="text-gray-600 mt-1">Click on any employee row to view details</p>
            </div>

          {employees.length === 0 ? (
            <div className="p-12 text-center">
              <Users className="w-16 h-16 text-gray-800/30 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">No Employees Found</h3>
              <p className="text-gray-800/70">No employees have been assigned to your organization yet.</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                {/* Desktop Table */}
                <div className="hidden lg:block">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gradient-to-br from-primary-start/10 to-primary-end/8 border-b border-primary-start/20">
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Employee</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Code</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Email</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200/50">
                      {currentEmployees.map((employee) => (
                        <tr 
                          key={employee.id} 
                          className="hover:bg-gradient-to-br from-primary-start/8 to-primary-end/5 transition-colors duration-200 cursor-pointer"
                          onClick={() => handleEmployeeClick(employee)}
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-gradient-to-r from-primary-start to-primary-end rounded-lg flex items-center justify-center shadow-md">
                                <User className="w-5 h-5 text-white" />
                              </div>
                              <div>
                                <p className="font-semibold text-gray-800">{employee.full_name}</p>
                                <p className="text-gray-500 text-sm">ID: {employee.user_id}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="px-3 py-1 bg-primary-start/15 border border-primary-start/30 rounded-lg text-gray-700 text-sm font-medium">
                              {employee.employee_code}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center space-x-2">
                              <Mail className="w-4 h-4 text-gray-500" />
                              <span className="text-gray-700">{employee.email}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${
                              employee.is_active
                                ? 'bg-green-100 text-green-800 border-green-200'
                                : 'bg-red-100 text-red-800 border-red-200'
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
                  {currentEmployees.map((employee) => (
                    <div 
                      key={employee.id} 
                      className="bg-gradient-to-br from-white/80 to-white/90 rounded-xl p-4 border border-primary-start/20 cursor-pointer hover:bg-primary-start/8 transition-colors duration-200 shadow-md"
                      onClick={() => handleEmployeeClick(employee)}
                    >
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="w-12 h-12 bg-gradient-to-r from-primary-start to-primary-end rounded-lg flex items-center justify-center shadow-md">
                          <User className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-800">{employee.full_name}</h3>
                          <p className="text-gray-500 text-sm">{employee.employee_code}</p>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${
                          employee.is_active
                            ? 'bg-green-100 text-green-800 border-green-200'
                            : 'bg-red-100 text-red-800 border-red-200'
                        }`}>
                          {employee.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center space-x-2">
                          <Mail className="w-4 h-4 text-gray-500" />
                          <span className="text-gray-600">{employee.email}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="p-6 border-t border-primary-start/20 bg-gradient-to-r from-primary-start/3 to-primary-end/3">
                  <div className="flex flex-col items-center gap-4">
                    {/* Page Info */}
                    <div className="text-gray-600 text-sm text-center">
                      Showing {indexOfFirstEmployee + 1} to {Math.min(indexOfLastEmployee, employees.length)} of {employees.length} employees
                    </div>

                    {/* Pagination Controls */}
                    <div className="flex items-center space-x-2">
                      {/* Previous Button */}
                      <button
                        onClick={goToPreviousPage}
                        disabled={currentPage === 1}
                        className={`p-2 rounded-lg border transition-all duration-200 ${
                          currentPage === 1
                            ? 'border-gray-300 text-gray-400 cursor-not-allowed'
                            : 'border-primary-start/30 text-gray-700 hover:border-primary-start/50 hover:bg-gradient-to-br from-primary-start/10 to-primary-end/5'
                        }`}
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>

                      {/* Page Numbers */}
                      <div className="flex items-center space-x-1">
                        {getPageNumbers().map((pageNumber) => (
                          <button
                            key={pageNumber}
                            onClick={() => goToPage(pageNumber)}
                            className={`px-3 py-2 rounded-lg border text-sm font-medium transition-all duration-200 ${
                              pageNumber === currentPage
                                ? 'bg-gradient-to-r from-primary-start to-primary-end text-white border-primary-end shadow-md'
                                : 'border-primary-start/30 text-gray-700 hover:border-primary-start/50 hover:bg-gradient-to-br from-primary-start/10 to-primary-end/5'
                            }`}
                          >
                            {pageNumber}
                          </button>
                        ))}
                      </div>

                      {/* Next Button */}
                      <button
                        onClick={goToNextPage}
                        disabled={currentPage === totalPages}
                        className={`p-2 rounded-lg border transition-all duration-200 ${
                          currentPage === totalPages
                            ? 'border-gray-300 text-gray-400 cursor-not-allowed'
                            : 'border-primary-start/30 text-gray-700 hover:border-primary-start/50 hover:bg-gradient-to-br from-primary-start/10 to-primary-end/5'
                        }`}
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
        ) : activeTab === 'complaints' ? (
          <HRComplaints />
        ) : (
          <BulkEmployeeUpload onUploadComplete={fetchEmployees} />
        )}
      </div>
    </div>
  )
}

export default HRDashboard 