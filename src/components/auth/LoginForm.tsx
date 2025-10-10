import React, { useState } from 'react'
import { Eye, EyeOff, Mail, Lock } from 'lucide-react'
import GoogleSignInButton from '../GoogleSignInButton'

interface LoginFormProps {
  onLogin: (email: string, password: string) => void
  onSwitchToSignup: () => void
  onForgotPassword: () => void
  onGoogleLogin?: () => void
  onResendVerification?: (email: string) => void
  isLoading?: boolean
  error?: string
  verificationRequired?: boolean
  canResendVerification?: boolean
}

const LoginForm: React.FC<LoginFormProps> = ({ 
  onLogin, 
  onSwitchToSignup, 
  onForgotPassword, 
  onGoogleLogin, 
  onResendVerification,
  isLoading = false, 
  error,
  verificationRequired = false,
  canResendVerification = false
}) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onLogin(email, password)
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="p-8 bg-white/90 backdrop-blur-xl border border-primary-start/20 rounded-3xl shadow-2xl">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Welcome Back</h2>
          <p className="text-gray-600">Sign in to your account</p>
        </div>

        {error && (
          <div className={`mb-6 p-4 border rounded-lg ${
            verificationRequired 
              ? 'bg-yellow-50 border-yellow-300' 
              : 'bg-red-100 border-red-300'
          }`}>
            <div className="flex items-start space-x-2">
              <div className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center mt-0.5 ${
                verificationRequired ? 'bg-yellow-500' : 'bg-red-500'
              }`}>
                <span className="text-white text-xs font-bold">!</span>
              </div>
              <div>
                <p className={`text-sm font-medium ${
                  verificationRequired ? 'text-yellow-700' : 'text-red-700'
                }`}>
                  {verificationRequired ? 'Email Verification Required' : 'Login Error'}
                </p>
                <p className={`text-sm mt-1 ${
                  verificationRequired ? 'text-yellow-600' : 'text-red-600'
                }`}>
                  {error}
                </p>
                {verificationRequired && onResendVerification && canResendVerification && (
                  <button
                    onClick={() => onResendVerification(email)}
                    className="mt-2 text-sm text-blue-600 hover:text-blue-800 underline"
                  >
                    Resend verification email
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-start focus:border-primary-start transition-all duration-300"
                placeholder="Enter your email"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-12 py-3 bg-white border border-gray-300 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-start focus:border-primary-start transition-all duration-300"
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-300"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-6 bg-gradient-to-r from-primary-start to-primary-end text-white font-semibold rounded-lg hover:from-primary-end hover:to-primary-start transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        {/* Divider */}
        <div className="mt-6 mb-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or continue with</span>
            </div>
          </div>
        </div>

        {/* Google Sign-In Button */}
        {onGoogleLogin && (
          <GoogleSignInButton
            className="w-full"
            disabled={isLoading}
          />
        )}

        <div className="mt-4 text-center">
          <button
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              onForgotPassword()
            }}
            className="text-sm text-primary-start hover:text-primary-end font-medium transition-colors duration-300 cursor-pointer hover:underline"
            type="button"
          >
            Forgot your password?
          </button>
        </div>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Don't have an account?{' '}
            <button
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                onSwitchToSignup()
              }}
              className="text-primary-start hover:text-primary-end font-medium transition-colors duration-300 cursor-pointer hover:underline"
              type="button"
            >
              Sign up
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}

export default LoginForm 