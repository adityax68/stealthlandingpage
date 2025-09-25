import React, { useState } from 'react'
import LoginForm from './LoginForm'
import SignupForm from './SignupForm'
import { useAuth } from '../../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import { API_ENDPOINTS } from '../../config/api'

interface AuthPageProps {
  initialMode?: 'login' | 'signup'
}

const AuthPage: React.FC<AuthPageProps> = ({ initialMode = 'signup' }) => {
  const [isLogin, setIsLogin] = useState(initialMode === 'login')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const { login } = useAuth()

  const clearError = () => {
    setError('')
  }

  const handleLogin = async (email: string, password: string) => {
    setIsLoading(true)
    setError('')
    
    try {
      await login(email, password)
      
      // Check if there's pending mood data
      const hasPendingMood = localStorage.getItem('moodAssessment') !== null
      if (hasPendingMood) {
        // Navigate to home to trigger mood assessment flow
        navigate('/')
      } else {
        navigate('/dashboard')
      }
    } catch (err: any) {
      console.error('Login error:', err)
      setError(err.message || 'Login failed. Please try again.')
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
        // After successful signup, automatically login to get the token
        await handleLogin(signupData.email, signupData.password)
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
    setIsLogin(false)
  }

  const switchToLogin = () => {
    clearError()
    setIsLogin(true)
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
        {isLogin ? (
          <LoginForm
            onLogin={handleLogin}
            onSwitchToSignup={switchToSignup}
            isLoading={isLoading}
            error={error}
          />
        ) : (
          <SignupForm
            onSignup={handleSignup}
            onSwitchToLogin={switchToLogin}
            isLoading={isLoading}
            error={error}
          />
        )}
      </div>
    </div>
  )
}

export default AuthPage 