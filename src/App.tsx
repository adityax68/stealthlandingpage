import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom'
import Header from './components/Header'
import Hero from './components/Hero'
import Features from './components/Features'
import Footer from './components/Footer'
import SplashScreen from './components/SplashScreen'
import AuthPage from './components/auth/AuthPage'
import ChooseAccountType from './components/auth/ChooseAccountType'
import OrganizationSignupForm from './components/auth/OrganizationSignupForm'
import OrganizationLoginForm from './components/auth/OrganizationLoginForm'
import EmployeeSignupForm from './components/auth/EmployeeSignupForm'
import EmployeeLoginForm from './components/auth/EmployeeLoginForm'
import Dashboard from './components/Dashboard'
import AdminDashboard from './components/admin/AdminDashboard'
import ChatBot from './components/ChatBot'
import { API_ENDPOINTS } from './config/api'

import { AuthProvider } from './contexts/AuthContext'

function AppContent() {
  const [showSplash, setShowSplash] = useState(false)
  const [hasSeenSplash, setHasSeenSplash] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState<Record<string, unknown> | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()
  const location = useLocation()
  const [error, setError] = useState('')


  useEffect(() => {
    // Check if user is already authenticated
    const token = localStorage.getItem('token')
    const userData = localStorage.getItem('user')
    
    if (token && userData) {
      try {
        const parsedUserData = JSON.parse(userData)
        setIsAuthenticated(true)
        setUser(parsedUserData)
      } catch (error) {
        console.error('Error parsing user data from localStorage:', error)
        // Clear invalid data
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        setIsAuthenticated(false)
        setUser(null)
      }
    }
    setIsLoading(false)
  }, [])

  // Show splash screen only on first visit to home page
  useEffect(() => {
    if (location.pathname === '/' && !hasSeenSplash) {
      setShowSplash(true)
    } else {
      setShowSplash(false)
    }
  }, [location.pathname, hasSeenSplash])

  const handleSplashComplete = () => {
    setShowSplash(false)
    setHasSeenSplash(true)
    // Navigate to home page after splash screen completes
    if (location.pathname !== '/') {
      navigate('/', { replace: true })
    }
  }

  const handleAuthSuccess = (token: string, userData: Record<string, unknown>) => {
    console.log('handleAuthSuccess called with:', { token, userData })
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(userData))
    setIsAuthenticated(true)
    setUser(userData)
    setIsLoading(false) // Stop loading after successful auth
    console.log('Authentication state updated, isAuthenticated:', true)
  }

  // Navigate to dashboard when authentication state changes
  useEffect(() => {
    if (isAuthenticated && user) {
      console.log('User authenticated, navigating to dashboard...')
      navigate('/dashboard')
    }
  }, [isAuthenticated, user, navigate])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setIsAuthenticated(false)
    setUser(null)
    navigate('/', { replace: true })
  }

  const handleOrganizationSignup = async (companyName: string, hremail: string, password: string) => {
    setIsLoading(true)
    setError('')
    
    try {
      const response = await fetch(API_ENDPOINTS.ORGANIZATION_SIGNUP, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ company_name: companyName, hremail, password }),
      })

      const data = await response.json()

      if (response.ok) {
        // After successful signup, directly authenticate and redirect to dashboard
        // Expected API response: { access_token: "jwt_token", user: { id, company_name, hremail, role } }
        handleAuthSuccess(data.access_token, data.user)
        // Navigation will be handled by useEffect when isAuthenticated changes
      } else {
        setError(data.detail || 'Organization registration failed. Please try again.')
        setIsLoading(false)
      }
    } catch (err) {
      console.error('Organization signup error:', err)
      if (err instanceof TypeError && err.message.includes('fetch')) {
        setError('Backend API not available yet. Please ensure the server is running.')
      } else {
        setError('Connection error. Please check your internet and try again.')
      }
      setIsLoading(false)
    }
  }

  const handleOrganizationLogin = async (hremail: string, password: string) => {
    setIsLoading(true)
    setError('')
    
    try {
      const formData = new URLSearchParams()
      formData.append('hremail', hremail)
      formData.append('password', password)
      
      const response = await fetch(API_ENDPOINTS.ORGANIZATION_LOGIN, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData,
      })

      const data = await response.json()

      if (response.ok) {
        // Expected API response: { access_token: "jwt_token", user: { id, company_name, hremail, role } }
        console.log('Login successful:', data)
        handleAuthSuccess(data.access_token, data.user)
        // Navigation will be handled by useEffect when isAuthenticated changes
      } else {
        setError(data.detail || 'Login failed. Please check your credentials.')
        setIsLoading(false)
      }
    } catch (err) {
      console.error('Organization login error:', err)
      if (err instanceof TypeError && err.message.includes('fetch')) {
        setError('Backend API not available yet. Please ensure the server is running.')
      } else {
        setError('Connection error. Please check your internet and try again.')
      }
      setIsLoading(false)
    }
  }

  const handleEmployeeSignup = async (companyId: string, employeeEmail: string, password: string, name: string, dob: string, phoneNumber: string, joiningDate: string) => {
    setIsLoading(true)
    setError('')
    
    try {
      const response = await fetch(API_ENDPOINTS.EMPLOYEE_SIGNUP, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          company_id: companyId, 
          employee_email: employeeEmail, 
          password, 
          name, 
          dob, 
          phone_number: phoneNumber, 
          joining_date: joiningDate 
        }),
      })

      const data = await response.json()

      if (response.ok) {
        // After successful signup, directly authenticate and redirect to dashboard
        // Expected API response: { access_token: "jwt_token", user: { id, company_name, employee_email, name, role } }
        handleAuthSuccess(data.access_token, data.user)
        // Navigation will be handled by useEffect when isAuthenticated changes
      } else {
        setError(data.detail || 'Employee registration failed. Please try again.')
        setIsLoading(false)
      }
    } catch (err) {
      console.error('Employee signup error:', err)
      if (err instanceof TypeError && err.message.includes('fetch')) {
        setError('Backend API not available yet. Please ensure the server is running.')
      } else {
        setError('Connection error. Please check your internet and try again.')
      }
      setIsLoading(false)
    }
  }

  const handleEmployeeLogin = async (companyId: string, employeeEmail: string, password: string) => {
    setIsLoading(true)
    setError('')
    
    try {
      const formData = new URLSearchParams()
      formData.append('company_id', companyId)
      formData.append('employee_email', employeeEmail)
      formData.append('password', password)
      
      const response = await fetch(API_ENDPOINTS.EMPLOYEE_LOGIN, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData,
      })

      const data = await response.json()

      if (response.ok) {
        // Expected API response: { access_token: "jwt_token", user: { id, company_name, employee_email, name, role } }
        handleAuthSuccess(data.access_token, data.user)
        // Navigation will be handled by useEffect when isAuthenticated changes
      } else {
        setError(data.detail || 'Login failed. Please check your credentials.')
        setIsLoading(false)
      }
    } catch (err) {
      console.error('Employee login error:', err)
      if (err instanceof TypeError && err.message.includes('fetch')) {
        setError('Backend API not available yet. Please ensure the server is running.')
      } else {
        setError('Connection error. Please check your internet and try again.')
      }
      setIsLoading(false)
    }
  }


  if (showSplash) {
    return <SplashScreen onComplete={handleSplashComplete} />
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    )
  }

  return (
    <div className="app">
      <Routes>
        <Route path="/auth" element={
          isAuthenticated ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <AuthPage onAuthSuccess={handleAuthSuccess} />
          )
        } />
        
        {/* Choose Account Type Routes */}
        <Route path="/auth/choose-signup" element={
          isAuthenticated ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <ChooseAccountType type="signup" />
          )
        } />
        
        <Route path="/auth/choose-login" element={
          isAuthenticated ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <ChooseAccountType type="login" />
          )
        } />
        
        {/* Organization Auth Routes */}
        <Route path="/auth/organization/signup" element={
          isAuthenticated ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 flex items-center justify-center p-4">
              <OrganizationSignupForm
                onSignup={handleOrganizationSignup}
                onSwitchToLogin={() => navigate('/auth/organization/login')}
                isLoading={isLoading}
                error={error}
              />
            </div>
          )
        } />
        
        <Route path="/auth/organization/login" element={
          isAuthenticated ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 flex items-center justify-center p-4">
              <OrganizationLoginForm
                onLogin={handleOrganizationLogin}
                onSwitchToSignup={() => navigate('/auth/organization/signup')}
                isLoading={isLoading}
                error={error}
              />
            </div>
          )
        } />
        
        {/* Employee Auth Routes */}
        <Route path="/auth/employee/signup" element={
          isAuthenticated ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 flex items-center justify-center p-4">
              <EmployeeSignupForm
                onSignup={handleEmployeeSignup}
                onSwitchToLogin={() => navigate('/auth/employee/login')}
                isLoading={isLoading}
                error={error}
              />
            </div>
          )
        } />
        
        <Route path="/auth/employee/login" element={
          isAuthenticated ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 flex items-center justify-center p-4">
              <EmployeeLoginForm
                onLogin={handleEmployeeLogin}
                onSwitchToSignup={() => navigate('/auth/employee/signup')}
                isLoading={isLoading}
                error={error}
              />
            </div>
          )
        } />
        
        <Route path="/" element={
            <main>
            <Header isAuthenticated={isAuthenticated} />
              <Hero />
              <Features />
              <Footer />
            </main>
        } />
        <Route path="/dashboard" element={
          isAuthenticated ? (
            <Dashboard onLogout={handleLogout} user={user} />
          ) : (
            <Navigate to="/" replace />
          )
        } />
        <Route path="/admin" element={
          isAuthenticated ? (
            <AdminDashboard />
          ) : (
            <Navigate to="/" replace />
          )
        } />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      
      {/* ChatBot - Always visible when authenticated */}
      <ChatBot isAuthenticated={isAuthenticated} />
    </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  )
}

export default App
