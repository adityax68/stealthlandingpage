import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import Header from './components/Header'
import Hero from './components/Hero'
import Features from './components/Features'
import Footer from './components/Footer'
import SplashScreen from './components/SplashScreen'
import AuthPage from './components/auth/AuthPage'
import Dashboard from './components/Dashboard'

function AppContent() {
  const [showSplash, setShowSplash] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()


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
        console.error('Error parsing user data:', error)
        localStorage.removeItem('token')
        localStorage.removeItem('user')
      }
    }
    setIsLoading(false)
  }, [])

  const handleSplashComplete = () => {
    setShowSplash(false)
  }

  const handleAuthSuccess = (token: string, userData: any) => {
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(userData))
    setIsAuthenticated(true)
    setUser(userData)
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setIsAuthenticated(false)
    setUser(null)
    navigate('/', { replace: true })
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
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  )
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  )
}

export default App
