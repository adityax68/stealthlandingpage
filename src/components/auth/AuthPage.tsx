import React, { useState } from 'react'
import LoginForm from './LoginForm'
import SignupForm from './SignupForm'

import { useNavigate } from 'react-router-dom'

interface AuthPageProps {
  onAuthSuccess: (token: string, user: any) => void
}

const AuthPage: React.FC<AuthPageProps> = ({ onAuthSuccess }) => {
  const [isLogin, setIsLogin] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleLogin = async (email: string, password: string) => {
    setIsLoading(true)
    setError('')
    
    try {
      const formData = new URLSearchParams()
      formData.append('username', email)
      formData.append('password', password)
      
      const response = await fetch('http://localhost:8000/api/v1/auth/login', {
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
        setError(data.detail || 'Login failed')
      }
    } catch (err) {
      setError('Network error. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignup = async (name: string, email: string, password: string) => {
    setIsLoading(true)
    setError('')
    
    try {
      const response = await fetch('http://localhost:8000/api/v1/auth/signup', {
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
        setError(data.detail || 'Registration failed')
        setIsLoading(false)
      }
    } catch (err) {
      setError('Network error. Please try again.')
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {isLogin ? (
          <LoginForm
            onLogin={handleLogin}
            onSwitchToSignup={() => setIsLogin(false)}
            isLoading={isLoading}
            error={error}
          />
        ) : (
          <SignupForm
            onSignup={handleSignup}
            onSwitchToLogin={() => setIsLogin(true)}
            isLoading={isLoading}
            error={error}
          />
        )}
      </div>
    </div>
  )
}

export default AuthPage 