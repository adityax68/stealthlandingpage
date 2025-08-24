import React, { useState } from 'react'
import { Eye, EyeOff, Mail, Lock, Building2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

interface OrganizationSignupFormProps {
  onSignup: (companyName: string, hremail: string, password: string) => void
  onSwitchToLogin: () => void
  isLoading?: boolean
  error?: string
}

const OrganizationSignupForm: React.FC<OrganizationSignupFormProps> = ({ 
  onSignup, 
  onSwitchToLogin, 
  isLoading = false, 
  error 
}) => {
  const [companyName, setCompanyName] = useState('')
  const [hremail, setHremail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      return
    }
    onSignup(companyName, hremail, password)
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
            <Building2 className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">Organization Signup</h2>
          <p className="text-white/70">Create your company account</p>
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
            <label htmlFor="companyName" className="block text-sm font-medium text-white/80 mb-2">
              Company Name
            </label>
            <div className="relative">
              <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-5 h-5" />
              <input
                id="companyName"
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-primary-start focus:border-transparent transition-all duration-300"
                placeholder="Enter your company name"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="hremail" className="block text-sm font-medium text-white/80 mb-2">
              HR Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-5 h-5" />
              <input
                id="hremail"
                type="email"
                value={hremail}
                onChange={(e) => setHremail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-primary-start focus:border-transparent transition-all duration-300"
                placeholder="Enter HR email address"
                required
              />
            </div>
            <p className="mt-1 text-white/50 text-xs">This will be your login email for HR dashboard</p>
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
            {isLoading ? 'Creating Account...' : 'Create Organization Account'}
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
              Already have an organization account?{' '}
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

export default OrganizationSignupForm
