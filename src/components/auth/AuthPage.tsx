import React, { useState } from 'react'
import LoginForm from './LoginForm'
import SignupForm from './SignupForm'
import ForgotPasswordForm from './ForgotPasswordForm'
import ResetPasswordForm from './ResetPasswordForm'
import { useAuth } from '../../contexts/AuthContext'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { API_ENDPOINTS } from '../../config/api'

interface AuthPageProps {
  initialMode?: 'login' | 'signup' | 'forgot-password' | 'reset-password' | 'verification-sent'
}

const AuthPage: React.FC<AuthPageProps> = ({ initialMode = 'signup' }) => {
  const [mode, setMode] = useState<'login' | 'signup' | 'forgot-password' | 'reset-password' | 'verification-sent'>(initialMode)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [verificationEmail, setVerificationEmail] = useState('')
  const [verificationRequired, setVerificationRequired] = useState(false)
  const [canResendVerification, setCanResendVerification] = useState(false)
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { login, loginWithGoogle } = useAuth()

  // Get reset token from URL params if in reset-password mode
  const resetToken = searchParams.get('token')

  const clearError = () => {
    setError('')
    setVerificationRequired(false)
    setCanResendVerification(false)
  }

  const handleLogin = async (email: string, password: string) => {
    setIsLoading(true)
    setError('')
    setVerificationRequired(false)
    setCanResendVerification(false)
    
    try {
      const result = await login(email, password)
      
      if (result.success) {
        // Check if there's pending mood data
        const hasPendingMood = localStorage.getItem('moodAssessment') !== null
        if (hasPendingMood) {
          // Navigate to home to trigger mood assessment flow
          navigate('/')
        } else {
          navigate('/dashboard')
        }
      } else if (result.verificationRequired) {
        // Handle verification required
        setVerificationRequired(true)
        setCanResendVerification(result.canResendVerification || false)
        setError(result.message || 'Please verify your email before logging in.')
        setVerificationEmail(email)
      } else {
        setError(result.message || 'Login failed. Please try again.')
      }
    } catch (err: any) {
      console.error('Login error:', err)
      setError(err.message || 'Login failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    setIsLoading(true)
    setError('')
    
    try {
      await loginWithGoogle()
      
      // Check if there's pending mood data
      const hasPendingMood = localStorage.getItem('moodAssessment') !== null
      if (hasPendingMood) {
        // Navigate to home to trigger mood assessment flow
        navigate('/')
      } else {
        navigate('/dashboard')
      }
    } catch (err: any) {
      console.error('Google login error:', err)
      setError(err.message || 'Google login failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignup = async (signupData: any) => {
    setIsLoading(true)
    setError('')
    
    try {
      const response = await fetch(API_ENDPOINTS.SIGNUP, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          full_name: signupData.name, 
          email: signupData.email, 
          password: signupData.password, 
          username: signupData.email,
          age: signupData.age,
          country: signupData.country,
          state: signupData.state,
          city: signupData.city
        }),
      })

      const data = await response.json()

      if (response.ok) {
        // Check if email verification is required
        if (data.verification_required && data.verification_sent) {
          // Show verification message instead of auto-login
          setVerificationEmail(data.email)
          setMode('verification-sent')
          return
        } else if (data.verification_required && !data.verification_sent) {
          // Verification required but email not sent - show error
          setError('Account created but verification email could not be sent. Please try logging in.')
          return
        } else {
          // No verification required (e.g., Google OAuth) - proceed with auto-login
          await handleLogin(signupData.email, signupData.password)
        }
      } else {
        // Handle specific signup error messages
        if (response.status === 400) {
          // Check for error field first (from custom exception handler), then detail field
          const errorMessage = data.error || data.detail
          
          if (errorMessage === 'Email already registered') {
            setError('This email is already registered. Please use a different email or try signing in.')
          } else if (errorMessage === 'Username already taken') {
            setError('This email is already registered. Please use a different email.')
          } else if (errorMessage === 'Email or username already exists') {
            setError('This email is already registered. Please use a different email.')
          } else if (Array.isArray(data.detail)) {
            // Handle Pydantic validation errors
            const validationErrors = data.detail.map((error: any) => {
              if (error.loc && error.loc.includes('email')) {
                return 'Please enter a valid email address.'
              } else if (error.loc && error.loc.includes('password')) {
                return 'Password must be at least 8 characters long.'
              } else if (error.loc && error.loc.includes('full_name')) {
                return 'Please enter your full name.'
              } else {
                return error.msg || 'Please check your input.'
              }
            })
            setError(validationErrors[0] || 'Please check your information.')
          } else if (errorMessage && typeof errorMessage === 'string') {
            // Handle other string error messages
            if (errorMessage.includes('email')) {
              setError('Please enter a valid email address.')
            } else if (errorMessage.includes('password')) {
              setError('Password must be at least 8 characters long.')
            } else if (errorMessage.includes('full_name')) {
              setError('Please enter your full name.')
            } else {
              setError(errorMessage)
            }
          } else {
            setError('Registration failed. Please check your information and try again.')
          }
        } else if (response.status === 503) {
          setError('Database connection error. Please try again in a moment.')
        } else {
          setError(data.error || data.detail || 'Registration failed. Please try again.')
        }
        setIsLoading(false)
      }
    } catch (err) {
      console.error('Signup error:', err)
      setError('Connection error. Please check your internet and try again.')
      setIsLoading(false)
    }
  }

  const switchToSignup = () => {
    clearError()
    setMode('signup')
  }

  const switchToLogin = () => {
    clearError()
    setMode('login')
  }

  const switchToForgotPassword = () => {
    clearError()
    setMode('forgot-password')
  }

  const handleForgotPasswordSuccess = () => {
    setMode('login')
  }

  const handleResetPasswordSuccess = () => {
    setMode('login')
  }

  const handleResendVerification = async (email?: string) => {
    const emailToUse = email || verificationEmail
    if (!emailToUse) return
    
    setIsLoading(true)
    setError('')
    
    try {
      const response = await fetch(API_ENDPOINTS.RESEND_VERIFICATION, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: emailToUse }),
      })

      const data = await response.json()

      if (response.ok) {
        // Show success message
        setError('') // Clear any previous errors
        // You could add a success state here if needed
      } else {
        setError(data.detail || 'Failed to resend verification email. Please try again.')
      }
    } catch (err) {
      console.error('Resend verification error:', err)
      setError('Connection error. Please check your internet and try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-gray-100 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 left-10 w-48 h-48 md:top-20 md:left-20 md:w-72 md:h-72 bg-gradient-to-br from-primary-start/20 to-primary-end/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-10 right-10 w-64 h-64 md:bottom-20 md:right-20 md:w-96 md:h-96 bg-gradient-to-br from-secondary-start/20 to-secondary-end/20 rounded-full blur-3xl animate-float-delayed"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-56 h-56 md:w-80 md:h-80 bg-gradient-to-br from-accent-start/15 to-accent-end/15 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-primary-start/5 via-transparent to-accent-start/5 animate-water-flow"></div>
      </div>
      <div className="w-full max-w-md relative z-10">
        {mode === 'login' && (
          <LoginForm
            onLogin={handleLogin}
            onSwitchToSignup={switchToSignup}
            onForgotPassword={switchToForgotPassword}
            onGoogleLogin={handleGoogleLogin}
            onResendVerification={handleResendVerification}
            isLoading={isLoading}
            error={error}
            verificationRequired={verificationRequired}
            canResendVerification={canResendVerification}
          />
        )}
        {mode === 'signup' && (
          <SignupForm
            onSignup={handleSignup}
            onSwitchToLogin={switchToLogin}
            isLoading={isLoading}
            error={error}
          />
        )}
        {mode === 'forgot-password' && (
          <ForgotPasswordForm
            onBackToLogin={switchToLogin}
            onSuccess={handleForgotPasswordSuccess}
          />
        )}
        {mode === 'reset-password' && resetToken && (
          <ResetPasswordForm
            token={resetToken}
            onSuccess={handleResetPasswordSuccess}
            onBackToLogin={switchToLogin}
          />
        )}
        {mode === 'reset-password' && !resetToken && (
          <div className="p-8 bg-white/90 backdrop-blur-xl border border-primary-start/20 rounded-3xl shadow-2xl text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Invalid Reset Link</h2>
            <p className="text-gray-600 mb-6">
              The password reset link is invalid or has expired.
            </p>
            <button
              onClick={switchToLogin}
              className="w-full py-3 px-6 bg-gradient-to-r from-primary-start to-primary-end text-white font-semibold rounded-lg hover:from-primary-end hover:to-primary-start transition-all duration-300 transform hover:scale-105"
            >
              Back to Login
            </button>
          </div>
        )}
        {mode === 'verification-sent' && (
          <div className="p-8 bg-white/90 backdrop-blur-xl border border-primary-start/20 rounded-3xl shadow-2xl text-center">
            <div className="mb-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Check Your Email</h2>
              <p className="text-gray-600 mb-4">
                We've sent a verification link to <strong>{verificationEmail}</strong>
              </p>
              <p className="text-gray-500 text-sm">
                Please check your email and click the verification link to activate your account.
              </p>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-100 border border-red-300 rounded-lg">
                <div className="flex items-start space-x-2">
                  <div className="flex-shrink-0 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center mt-0.5">
                    <span className="text-white text-xs font-bold">!</span>
                  </div>
                  <div>
                    <p className="text-red-700 text-sm font-medium">Error</p>
                    <p className="text-red-600 text-xs mt-1">{error}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-3">
              <button
                onClick={() => handleResendVerification()}
                disabled={isLoading}
                className="w-full py-3 px-6 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isLoading ? 'Sending...' : 'Resend Verification Email'}
              </button>
              
              <button
                onClick={switchToLogin}
                className="w-full py-3 px-6 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-all duration-300"
              >
                Back to Login
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AuthPage 