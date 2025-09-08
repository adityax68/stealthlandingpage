import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useLocation, useSearchParams } from 'react-router-dom'
import Header from './components/Header'
import Hero from './components/Hero'
import Features from './components/Features'
import Footer from './components/Footer'
import SplashScreen from './components/SplashScreen'
import AuthPage from './components/auth/AuthPage'
import Dashboard from './components/Dashboard'
import AdminDashboard from './components/admin/AdminDashboard'
import ChatBot from './components/ChatBot'
import ToastContainer from './components/ui/ToastContainer'
import TestSelector from './components/assessment/TestSelector'
import DynamicTestRunner from './components/assessment/DynamicTestRunner'
import TestResults from './components/assessment/TestResults'
import ErrorBoundary from './components/ErrorBoundary'

import { AuthProvider } from './contexts/AuthContext'
import { EmployeeModalProvider } from './contexts/EmployeeModalContext'
import { ToastProvider } from './contexts/ToastContext'
import EmployeeRequestModal from './components/EmployeeRequestModal'
import AuthModal from './components/auth/AuthModal'

function AppContent() {
  const [showSplash, setShowSplash] = useState(false)
  const [hasSeenSplash, setHasSeenSplash] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [currentTest, setCurrentTest] = useState<string | null>(null)
  const [testResults, setTestResults] = useState<any>(null)
  const [showTestSelector, setShowTestSelector] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const [searchParams] = useSearchParams()


  useEffect(() => {
    // Check if user is already authenticated
    const token = localStorage.getItem('token')
    const userData = localStorage.getItem('user')
    
    if (token && userData) {
      try {
        const parsedUserData = JSON.parse(userData)
        
        // Set authentication state immediately from localStorage
            setIsAuthenticated(true)
            setUser(parsedUserData)
          setIsLoading(false)
      } catch (error) {
        console.error('Error parsing user data from localStorage:', error)
        // Clear invalid data
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        setIsAuthenticated(false)
        setUser(null)
        setIsLoading(false)
      }
    } else {
      setIsLoading(false)
    }
  }, [])

  // Show splash screen only on first visit to home page
  useEffect(() => {
    if (location.pathname === '/' && !hasSeenSplash) {
      setShowSplash(true)
    } else {
      setShowSplash(false)
    }
  }, [location.pathname, hasSeenSplash])

  // Show auth modal when user visits landing page and is not authenticated
  useEffect(() => {
    if (location.pathname === '/' && !isAuthenticated && !isLoading && !showSplash) {
      setShowAuthModal(true)
    }
  }, [location.pathname, isAuthenticated, isLoading, showSplash])

  // Handle browser back button navigation and authentication state
  useEffect(() => {
    const handlePopState = () => {
      // Re-check authentication state when browser back button is pressed
      const token = localStorage.getItem('token')
      const userData = localStorage.getItem('user')
      
      if (token && userData) {
        try {
          const parsedUserData = JSON.parse(userData)
          if (!isAuthenticated || !user) {
            setIsAuthenticated(true)
            setUser(parsedUserData)
          }
        } catch (error) {
          console.error('Error parsing user data on navigation:', error)
          localStorage.removeItem('token')
          localStorage.removeItem('user')
          setIsAuthenticated(false)
          setUser(null)
        }
      } else {
        if (isAuthenticated) {
          setIsAuthenticated(false)
          setUser(null)
        }
      }
    }

    // Listen for browser back/forward navigation
    window.addEventListener('popstate', handlePopState)
    
    // Also check on location change
    handlePopState()

    return () => {
      window.removeEventListener('popstate', handlePopState)
    }
  }, [location.pathname, isAuthenticated, user])

  // Simple authentication check on mount
  useEffect(() => {
    const token = localStorage.getItem('token')
    const userData = localStorage.getItem('user')
    
    if (token && userData) {
      try {
        const parsedUserData = JSON.parse(userData)
        setIsAuthenticated(true)
        setUser(parsedUserData)
      } catch (error) {
        console.error('Error parsing user data-:', error)
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        setIsAuthenticated(false)
        setUser(null)
      }
    } else {
      setIsAuthenticated(false)
      setUser(null)
    }
    setIsLoading(false)
  }, [])

  const handleSplashComplete = () => {
    setShowSplash(false)
    setHasSeenSplash(true)
    // Navigate to home page after splash screen completes
    if (location.pathname !== '/') {
      navigate('/', { replace: true })
    }
  }

  const handleAuthSuccess = (token: string, userData: any) => {
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(userData))
    setIsAuthenticated(true)
    setUser(userData)
    setShowAuthModal(false) // Close modal on successful authentication
  }

  const handleCloseAuthModal = () => {
    setShowAuthModal(false)
  }


  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setIsAuthenticated(false)
    setUser(null)
    navigate('/', { replace: true })
  }

  const handleUserRoleUpdate = (newRole: string) => {
    if (user) {
      const updatedUser = { ...user, role: newRole }
      setUser(updatedUser)
      localStorage.setItem('user', JSON.stringify(updatedUser))
    }
  }

  // Test system handlers
  const handleTestSelect = (testCode: string) => {
    setCurrentTest(testCode)
    setShowTestSelector(false)
  }

  const handleTestComplete = (results: any) => {
    setTestResults(results)
    setCurrentTest(null)
  }


  const handleBackToDashboard = () => {
    setCurrentTest(null)
    setTestResults(null)
    setShowTestSelector(false)
    navigate('/dashboard')
  }

  const handleTakeAnotherTest = () => {
    setTestResults(null)
    setShowTestSelector(true)
  }

  // Handle URL parameters for direct test selection
  useEffect(() => {
    if (location.pathname === '/tests') {
      const testParam = searchParams.get('test')
      if (testParam && ['phq9', 'gad7', 'pss10'].includes(testParam)) {
        setCurrentTest(testParam)
        setShowTestSelector(false)
      } else {
        setShowTestSelector(true)
      }
    }
  }, [location.pathname, searchParams])


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
            <ErrorBoundary>
              <Dashboard onLogout={handleLogout} user={user} />
            </ErrorBoundary>
          ) : (
            <Navigate to="/" replace />
          )
        } />
        <Route path="/admin" element={
          isLoading ? (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 flex items-center justify-center">
              <div className="text-white text-xl">Loading...</div>
            </div>
          ) : isAuthenticated ? (
            <ErrorBoundary>
              <AdminDashboard />
            </ErrorBoundary>
          ) : (
            <Navigate to="/" replace />
          )
        } />
        
        {/* Test System Routes */}
        <Route path="/tests" element={
          isAuthenticated ? (
            showTestSelector ? (
              <TestSelector 
                onTestSelect={handleTestSelect}
                onBack={handleBackToDashboard}
              />
            ) : currentTest ? (
              <DynamicTestRunner
                testCode={currentTest}
                onComplete={handleTestComplete}
                onBack={handleBackToDashboard}
              />
            ) : testResults ? (
              <TestResults
                results={testResults}
                onBack={handleBackToDashboard}
                onTakeAnother={handleTakeAnotherTest}
              />
            ) : (
              <TestSelector 
                onTestSelect={handleTestSelect}
                onBack={handleBackToDashboard}
              />
            )
          ) : (
            <Navigate to="/" replace />
          )
        } />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      
      {/* ChatBot - Always visible when authenticated */}
      <ChatBot isAuthenticated={isAuthenticated} />
      
      {/* Employee Request Modal - Rendered at app level */}
      <EmployeeRequestModal onRoleUpdate={handleUserRoleUpdate} />
      
      {/* Auth Modal - Rendered at app level */}
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={handleCloseAuthModal} 
        onAuthSuccess={handleAuthSuccess}
      />
    </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <EmployeeModalProvider>
        <ToastProvider>
          <Router>
            <AppContent />
            <ToastContainer />
          </Router>
        </ToastProvider>
      </EmployeeModalProvider>
    </AuthProvider>
  )
}

export default App
