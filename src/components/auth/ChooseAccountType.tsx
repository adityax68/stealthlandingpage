import React from 'react'
import { Building2, Users, ArrowRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

interface ChooseAccountTypeProps {
  type: 'signup' | 'login'
}

const ChooseAccountType: React.FC<ChooseAccountTypeProps> = ({ type }) => {
  const navigate = useNavigate()
  const isSignup = type === 'signup'

  const handleOrganizationClick = () => {
    if (isSignup) {
      navigate('/auth/organization/signup')
    } else {
      navigate('/auth/organization/login')
    }
  }

  const handleEmployeeClick = () => {
    if (isSignup) {
      navigate('/auth/employee/signup')
    } else {
      navigate('/auth/employee/login')
    }
  }

  const handleBackClick = () => {
    if (isSignup) {
      navigate('/auth')
    } else {
      navigate('/auth')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20 shadow-2xl">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">
              Choose Account Type
            </h2>
            <p className="text-white/70">
              {isSignup 
                ? 'Select how you want to create your account' 
                : 'Select how you want to sign in'
              }
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Organization (HR) Option */}
            <button
              onClick={handleOrganizationClick}
              className="group relative p-6 bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-xl hover:border-primary-start/50 hover:bg-white/15 transition-all duration-300 transform hover:scale-105"
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-primary-start to-primary-end rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Building2 className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Organization (HR)</h3>
                <p className="text-white/70 text-sm mb-4">
                  {isSignup 
                    ? 'Create company account and manage employees' 
                    : 'Access HR dashboard and analytics'
                  }
                </p>
                <div className="flex items-center justify-center space-x-2 text-primary-start group-hover:text-primary-end transition-colors duration-300">
                  <span className="text-sm font-medium">
                    {isSignup ? 'Create Account' : 'Sign In'}
                  </span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                </div>
              </div>
            </button>

            {/* Employee Option */}
            <button
              onClick={handleEmployeeClick}
              className="group relative p-6 bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-xl hover:border-primary-start/50 hover:bg-white/15 transition-all duration-300 transform hover:scale-105"
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-primary-start to-primary-end rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Employee</h3>
                <p className="text-white/70 text-sm mb-4">
                  {isSignup 
                    ? 'Join your organization and access mental health resources' 
                    : 'Access your employee dashboard and assessments'
                  }
                </p>
                <div className="flex items-center justify-center space-x-2 text-primary-start group-hover:text-primary-end transition-colors duration-300">
                  <span className="text-sm font-medium">
                    {isSignup ? 'Create Account' : 'Sign In'}
                  </span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                </div>
              </div>
            </button>
          </div>

          {/* Back Button */}
          <div className="text-center">
            <button
              onClick={handleBackClick}
              className="text-white/70 hover:text-white transition-colors duration-300 text-sm"
            >
              ← Back to {isSignup ? 'Sign Up' : 'Sign In'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChooseAccountType
