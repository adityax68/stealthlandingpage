import React, { useState } from 'react'
import { Eye, EyeOff, Mail, Lock, Users, User, Phone, Calendar, Hash } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

interface EmployeeSignupFormProps {
  onSignup: (companyId: string, employeeEmail: string, password: string, name: string, dob: string, phoneNumber: string, joiningDate: string) => void
  onSwitchToLogin: () => void
  isLoading?: boolean
  error?: string
}

const EmployeeSignupForm: React.FC<EmployeeSignupFormProps> = ({ 
  onSignup, 
  onSwitchToLogin, 
  isLoading = false, 
  error 
}) => {
  const [companyId, setCompanyId] = useState('')
  const [employeeEmail, setEmployeeEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [name, setName] = useState('')
  const [dob, setDob] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [joiningDate, setJoiningDate] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      return
    }
    onSignup(companyId, employeeEmail, password, name, dob, phoneNumber, joiningDate)
  }

  const handleBackToChoose = () => {
    navigate('/auth/choose-signup')
  }

  const passwordsMatch = password === confirmPassword || confirmPassword === ''

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20 shadow-2xl">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-primary-start to-primary-end rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Users className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">Employee Signup</h2>
          <p className="text-white/70">Join your organization</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-lg">
            <div className="flex items-start space-x-2">
              <div className="flex-shrink-0 w-5 h-5 bg-red-400 rounded-full flex items-center justify-center mt-0.5">
                <span className="text-red-900 text-xs font-bold">!</span>
              </div>
              <div>
                <p className="text-red-300 text-sm font-medium">Registration Error</p>
                <p className="text-red-300/80 text-sm mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="companyId" className="block text-sm font-medium text-white/80 mb-2">
              Company ID
            </label>
            <div className="relative">
              <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-5 h-5" />
              <input
                id="companyId"
                type="text"
                value={companyId}
                onChange={(e) => setCompanyId(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-primary-start focus:border-transparent transition-all duration-300"
                placeholder="Enter your company ID"
                required
              />
            </div>
            <p className="mt-1 text-white/50 text-xs">Ask your HR for the company ID</p>
          </div>

          <div>
            <label htmlFor="name" className="block text-sm font-medium text-white/80 mb-2">
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-5 h-5" />
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-primary-start focus:border-transparent transition-all duration-300"
                placeholder="Enter your full name"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="employeeEmail" className="block text-sm font-medium text-white/80 mb-2">
              Employee Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-5 h-5" />
              <input
                id="employeeEmail"
                type="email"
                value={employeeEmail}
                onChange={(e) => setEmployeeEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-primary-start focus:border-transparent transition-all duration-300"
                placeholder="Enter your work email"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="dob" className="block text-sm font-medium text-white/80 mb-2">
                Date of Birth
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-5 h-5" />
                <input
                  id="dob"
                  type="date"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-primary-start focus:border-transparent transition-all duration-300"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="joiningDate" className="block text-sm font-medium text-white/80 mb-2">
                Joining Date
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-5 h-5" />
                <input
                  id="joiningDate"
                  type="date"
                  value={joiningDate}
                  onChange={(e) => setJoiningDate(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-primary-start focus:border-transparent transition-all duration-300"
                  required
                />
              </div>
            </div>
          </div>

          <div>
            <label htmlFor="phoneNumber" className="block text-sm font-medium text-white/80 mb-2">
              Phone Number
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-5 h-5" />
              <input
                id="phoneNumber"
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-primary-start focus:border-transparent transition-all duration-300"
                placeholder="Enter your phone number"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-white/80 mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-5 h-5" />
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-12 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-primary-start focus:border-transparent transition-all duration-300"
                placeholder="Create a password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white transition-colors duration-300"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-white/80 mb-2">
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-5 h-5" />
              <input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={`w-full pl-10 pr-12 py-3 bg-white/10 border rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-primary-start focus:border-transparent transition-all duration-300 ${
                  confirmPassword && !passwordsMatch
                    ? 'border-red-500/50 focus:ring-red-500'
                    : 'border-white/20'
                }`}
                placeholder="Confirm your password"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white transition-colors duration-300"
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {confirmPassword && !passwordsMatch && (
              <p className="mt-1 text-red-300 text-sm">Passwords do not match</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading || !passwordsMatch}
            className="w-full py-3 px-6 bg-gradient-to-r from-primary-start to-primary-end text-white font-semibold rounded-lg hover:from-primary-end hover:to-primary-start transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {isLoading ? 'Creating Account...' : 'Create Employee Account'}
          </button>
        </form>

        <div className="mt-6 text-center space-y-3">
          <button
            onClick={handleBackToChoose}
            className="text-white/70 hover:text-white transition-colors duration-300 text-sm"
          >
            ← Back to Account Type Selection
          </button>
          
          <div className="border-t border-white/10 pt-3">
            <p className="text-white/70">
              Already have an employee account?{' '}
              <button
                onClick={onSwitchToLogin}
                className="text-primary-start hover:text-primary-end font-medium transition-colors duration-300"
              >
                Sign in
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EmployeeSignupForm
