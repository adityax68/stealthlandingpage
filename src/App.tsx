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

import { AuthProvider, useAuth } from './contexts/AuthContext'
import { EmployeeModalProvider } from './contexts/EmployeeModalContext'
import { ToastProvider } from './contexts/ToastContext'
import { MoodProvider } from './contexts/MoodContext'
import SessionNotification from './components/SessionNotification'
import EmployeeRequestModal from './components/EmployeeRequestModal'

function AppContent() {
  const [showSplash, setShowSplash] = useState(false)
  const [hasSeenSplash, setHasSeenSplash] = useState(false)
  const [currentTest, setCurrentTest] = useState<string | null>(null)
  const [testResults, setTestResults] = useState<any>(null)
  const [showTestSelector, setShowTestSelector] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const [searchParams] = useSearchParams()
  
  // Use the new AuthContext
  const { user, isAuthenticated, logout, refreshToken, isRefreshing } = useAuth()


  // Remove old authentication logic - now handled by AuthContext

  // Show splash screen only on first visit to home page
  useEffect(() => {
    if (location.pathname === '/' && !hasSeenSplash) {
      setShowSplash(true)
    } else {
      setShowSplash(false)
    }
  }, [location.pathname, hasSeenSplash])


  // Remove old authentication state handling - now handled by AuthContext

  // Authentication is now handled by AuthContext

  const handleSplashComplete = () => {
    setShowSplash(false)
    setHasSeenSplash(true)
    // Navigate to home page after splash screen completes
    if (location.pathname !== '/') {
      navigate('/', { replace: true })
    }
  }

  const handleLogout = async () => {
    await logout()
    // Clear browser history and navigate to home
    window.history.replaceState(null, '', '/')
    navigate('/', { replace: true })
  }

  const handleUserRoleUpdate = (_newRole: string) => {
    // This is now handled by AuthContext
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

  // Loading is now handled by AuthContext

  return (
    <div className="app">
      {/* Session notification for token expiry */}
      <SessionNotification 
        onRefresh={refreshToken}
        onDismiss={() => {
          // User dismissed the notification - they'll be logged out when token expires
          console.log('Session notification dismissed by user');
        }}
        onLogout={handleLogout}
      />
      <Routes>
        <Route path="/auth" element={
          isAuthenticated ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <AuthPage initialMode="signup" />
          )
        } />
        <Route path="/login" element={
          isAuthenticated ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <AuthPage initialMode="login" />
          )
        } />
        <Route path="/" element={
            <main>
            <Header isAuthenticated={isAuthenticated} />
              <Hero isAuthenticated={isAuthenticated} />
              <Features />
              <Footer />
            </main>
        } />
        <Route path="/dashboard" element={
          isRefreshing ? (
            <div className="flex items-center justify-center min-h-screen">
              <div className="w-8 h-8 border-4 border-primary-start/30 border-t-primary-start rounded-full animate-spin"></div>
            </div>
          ) : isAuthenticated ? (
            <ErrorBoundary>
              <Dashboard onLogout={handleLogout} user={user} />
            </ErrorBoundary>
          ) : (
            <Navigate to="/" replace />
          )
        } />
        <Route path="/admin" element={
          isAuthenticated ? (
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
      
    </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <MoodProvider>
        <EmployeeModalProvider>
          <ToastProvider>
            <Router>
              <AppContent />
              <ToastContainer />
            </Router>
          </ToastProvider>
        </EmployeeModalProvider>
      </MoodProvider>
    </AuthProvider>
  )
}

export default App
