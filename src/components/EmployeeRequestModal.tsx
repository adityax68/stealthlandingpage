import React, { useState } from 'react'
import { X, User, Building, Mail } from 'lucide-react'
import { API_ENDPOINTS } from '../config/api'
import { useEmployeeModal } from '../contexts/EmployeeModalContext'
import { useAuth } from '../contexts/AuthContext'
import { useToast } from '../contexts/ToastContext'

interface EmployeeRequestModalProps {
  onRoleUpdate?: (newRole: string) => void
}

const EmployeeRequestModal: React.FC<EmployeeRequestModalProps> = ({ onRoleUpdate }) => {
  const { isEmployeeModalOpen, closeEmployeeModal, onEmployeeSuccess } = useEmployeeModal()
  const { updateUserRole } = useAuth()
  const { showToast } = useToast()
  const [formData, setFormData] = useState({
    employee_code: '',
    org_id: '',
    hr_email: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Clear error when user starts typing
    if (error) setError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const token = localStorage.getItem('access_token')
      if (!token) {
        setError('No authentication token found')
        return
      }

      const response = await fetch(API_ENDPOINTS.ACCESS_REQUEST_EMPLOYEE, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (response.ok) {
        // Show success toast
        showToast('Employee access granted', 'success')
        
        // Update user role in AuthContext if available
        if (data.new_role) {
          updateUserRole(data.new_role)
          // Also update the App component's user state
          if (onRoleUpdate) {
            onRoleUpdate(data.new_role)
          }
        }
        
        onEmployeeSuccess()
        closeEmployeeModal()
        // Reset form
        setFormData({ employee_code: '', org_id: '', hr_email: '' })
      } else {
        // Show error toast with specific handling for organization not found
        let errorMessage = data.detail || 'Failed to request employee access'
        
        if (response.status === 404 && errorMessage.includes('organization does not exist')) {
          errorMessage = 'Your organisation is not registered with us. Please contact your HR department to register your organisation.'
        } else if (response.status === 400 && errorMessage.includes('already has elevated access')) {
          errorMessage = 'You already have elevated access. No additional access is needed.'
        } else if (response.status === 400 && errorMessage.includes('Admin users cannot request additional access')) {
          errorMessage = 'Admin users already have full access to the system.'
        } else if (response.status === 400 && errorMessage.includes('HR email does not match')) {
          errorMessage = 'The HR email you provided does not match our records. Please verify with your HR department.'
        } else if (response.status === 400 && errorMessage.includes('Employee code already exists')) {
          errorMessage = 'This employee code is already registered. Please use a different code or contact support.'
        }
        
        showToast(errorMessage, 'error')
        setError(errorMessage)
      }
    } catch (error) {
      console.error('Error requesting employee access:', error)
      const errorMessage = 'Failed to request employee access. Please try again.'
      showToast(errorMessage, 'error')
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }



  if (!isEmployeeModalOpen) return null

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4" style={{ top: 0, left: 0, right: 0, bottom: 0 }}>
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={closeEmployeeModal}
      />
      
      {/* Modal */}
      <div className="relative bg-white/90 backdrop-blur-xl border border-primary-start/20 rounded-2xl p-6 w-full max-w-md mx-auto z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-800">Request Employee Access</h2>
          <button
            onClick={closeEmployeeModal}
            className="p-2 text-gray-800/70 hover:text-gray-800 hover:bg-primary-start/10 rounded-lg transition-colors duration-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Employee Code */}
          <div>
            <label className="block text-sm font-medium text-gray-800/70 mb-2">
              Employee Code
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-800/50" />
              <input
                type="text"
                name="employee_code"
                value={formData.employee_code}
                onChange={handleInputChange}
                placeholder="e.g., EMP001"
                className="w-full pl-10 pr-4 py-3 bg-white/5 border border-primary-start/20 rounded-lg text-gray-800 placeholder-white/50 focus:outline-none focus:border-primary-start transition-colors duration-200"
                required
              />
            </div>
          </div>

          {/* Organization ID */}
          <div>
            <label className="block text-sm font-medium text-gray-800/70 mb-2">
              Organization ID
            </label>
            <div className="relative">
              <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-800/50" />
              <input
                type="text"
                name="org_id"
                value={formData.org_id}
                onChange={handleInputChange}
                placeholder="e.g., ORG001"
                className="w-full pl-10 pr-4 py-3 bg-white/5 border border-primary-start/20 rounded-lg text-gray-800 placeholder-white/50 focus:outline-none focus:border-primary-start transition-colors duration-200"
                required
              />
            </div>
          </div>

          {/* HR Email */}
          <div>
            <label className="block text-sm font-medium text-gray-800/70 mb-2">
              HR Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-800/50" />
              <input
                type="email"
                name="hr_email"
                value={formData.hr_email}
                onChange={handleInputChange}
                placeholder="hr@company.com"
                className="w-full pl-10 pr-4 py-3 bg-white/5 border border-primary-start/20 rounded-lg text-gray-800 placeholder-white/50 focus:outline-none focus:border-primary-start transition-colors duration-200"
                required
              />
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-300 text-sm">
              {error}
            </div>
          )}

          {/* Buttons */}
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={closeEmployeeModal}
              className="flex-1 px-4 py-3 bg-primary-start/10 border border-primary-start/20 text-gray-800 rounded-lg hover:bg-white/20 transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-primary-start to-primary-end text-gray-800 rounded-lg hover:from-primary-end hover:to-primary-start transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Processing...' : 'Request Access'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EmployeeRequestModal 