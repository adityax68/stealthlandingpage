import React, { useState } from 'react'
import LoginForm from './LoginForm'
import SignupForm from './SignupForm'
import { API_ENDPOINTS } from '../../config/api'

import { useNavigate } from 'react-router-dom'

interface AuthPageProps {
  onAuthSuccess: (token: string, user: any) => void
}

const AuthPage: React.FC<AuthPageProps> = ({ onAuthSuccess }) => {
  const [isLogin, setIsLogin] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const clearError = () => {
    setError('')
  }

  const handleLogin = async (email: string, password: string) => {
    setIsLoading(true)
    setError('')
    
    try {
      const formData = new URLSearchParams()
      formData.append('username', email)
      formData.append('password', password)
      
      const response = await fetch(API_ENDPOINTS.LOGIN, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData,
      })

      const data = await response.json()

      if (response.ok) {
        onAuthSuccess(data.access_token, data.user)
        navigate('/dashboard')
      } else {
        // Handle specific error messages
        if (response.status === 401) {
          setError('Invalid credentials')
        } else if (response.status === 400) {
          setError(data.detail || 'Account is inactive. Please contact support.')
        } else if (response.status === 503) {
          setError('Database connection error. Please try again in a moment.')
        } else {
          setError(data.detail || 'Login failed. Please try again.')
        }
      }
    } catch (err) {
      console.error('Login error:', err)
      setError('Connection error. Please check your internet and try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignup = async (name: string, email: string, password: string) => {
    setIsLoading(true)
    setError('')
    
    try {
      const response = await fetch(API_ENDPOINTS.SIGNUP, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ full_name: name, email, password, username: email }),
      })

      const data = await response.json()

      if (response.ok) {
        // After successful signup, automatically login to get the token
        await handleLogin(email, password)
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
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