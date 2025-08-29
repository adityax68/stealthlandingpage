import React, { useState, useEffect, useRef } from 'react'
import { Menu, X, User, ChevronDown } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { API_ENDPOINTS } from '../config/api'
import { useEmployeeModal } from '../contexts/EmployeeModalContext'

interface HeaderProps {
  isAuthenticated?: boolean
}

const Header: React.FC<HeaderProps> = ({ isAuthenticated = false }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()
  const { openEmployeeModal } = useEmployeeModal()

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
    }

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isDropdownOpen])

  const navItems = [
    { label: 'Home', href: '#home' },
    { label: 'About', href: '#home' },
    { label: 'Features', href: '#features' },
    { label: 'Products', href: '#home' },
    { label: 'Contact', href: '#footer' }
  ]

  const requestAccessItems = [
    { label: 'Employee', value: 'employee' },
    { label: 'HR', value: 'hr' },
    { label: 'Counsellor', value: 'counsellor' }
  ]

  const handleLinkClick = (href: string) => {
    setIsMenuOpen(false)
    if (href === '#features') {
      document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })
    } else if (href === '#footer') {
      document.getElementById('footer')?.scrollIntoView({ behavior: 'smooth' })
    } else {
      // Scroll to the Coming Soon section in the hero
      const heroSection = document.querySelector('section')
      if (heroSection) {
        heroSection.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }

  const handleRequestAccess = async (accessType: string) => {
    setIsDropdownOpen(false)
    setIsMenuOpen(false)
    
    if (accessType === 'employee') {
      openEmployeeModal()
      return
    }
    
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        console.error('No authentication token found')
        return
      }

      const response = await fetch(`${API_ENDPOINTS.ACCESS_REQUEST}?access_type=${accessType}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      const data = await response.json()

      if (response.ok) {
        // Success - show success message
        showToast(`Success: ${data.message}`, 'success')
        // Optionally refresh the page or update user state
        window.location.reload()
      } else {
        // Error - show error message
        showToast(`Error: ${data.detail || 'Failed to request access'}`, 'error')
      }
    } catch (error) {
      console.error('Error requesting access:', error)
      showToast('Error: Failed to request access. Please try again.', 'error')
    }
  }

  const showToast = (message: string, type: 'success' | 'error') => {
    // Create toast element
    const toast = document.createElement('div')
    toast.className = `fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg transition-all duration-300 transform translate-x-full ${
      type === 'success' 
        ? 'bg-green-500 text-white' 
        : 'bg-red-500 text-white'
    }`
    toast.textContent = message

    // Add to DOM
    document.body.appendChild(toast)

    // Animate in
    setTimeout(() => {
      toast.classList.remove('translate-x-full')
    }, 100)

    // Remove after 5 seconds
    setTimeout(() => {
      toast.classList.add('translate-x-full')
      setTimeout(() => {
        document.body.removeChild(toast)
      }, 300)
    }, 5000)
  }



  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-xl border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-r from-primary-start to-primary-end rounded-lg flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-sm md:text-base">MA</span>
            </div>
            <span className="text-xl md:text-2xl font-bold gradient-text">Mind Acuity</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={(e) => {
                  e.preventDefault()
                  handleLinkClick(item.href)
                }}
                className="text-white/70 hover:text-white transition-colors duration-300 text-sm font-medium cursor-pointer"
              >
                {item.label}
              </a>
            ))}
            {isAuthenticated && (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center space-x-2 px-4 py-2 text-white/70 hover:text-white transition-colors duration-300 text-sm font-medium cursor-pointer"
                >
                  <span>Request Access</span>
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                {isDropdownOpen && (
                  <div className="absolute top-full left-0 mt-2 w-36 bg-gray-900 border border-white/20 rounded-lg shadow-lg overflow-hidden">
                    {requestAccessItems.map((item) => (
                      <button
                        key={item.value}
                        onClick={() => handleRequestAccess(item.value)}
                        className="w-full px-4 py-3 text-left text-white hover:bg-white/10 transition-colors duration-200 text-sm"
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
            {isAuthenticated ? (
              <button
                onClick={() => navigate('/dashboard')}
                className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-primary-start to-primary-end text-white rounded-lg hover:from-primary-end hover:to-primary-start transition-all duration-300"
              >
                <User className="w-4 h-4" />
                <span>Get Started</span>
              </button>
            ) : (
              <button
                onClick={() => navigate('/auth')}
                className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-primary-start to-primary-end text-white rounded-lg hover:from-primary-end hover:to-primary-start transition-all duration-300"
              >
                <User className="w-4 h-4" />
                <span>Sign In</span>
              </button>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden w-8 h-8 flex items-center justify-center text-white hover:text-primary-start transition-colors duration-300"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden py-4 border-t border-white/10">
            <div className="flex flex-col space-y-3">
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={(e) => {
                    e.preventDefault()
                    handleLinkClick(item.href)
                  }}
                  className="text-white/70 hover:text-white transition-colors duration-300 text-base font-medium py-2 px-3 rounded-lg hover:bg-white/5 cursor-pointer"
                >
                  {item.label}
                </a>
              ))}
              {isAuthenticated && (
                <div className="space-y-2">
                  <div className="text-white/50 text-sm font-medium px-3 py-1">Request Access</div>
                  {requestAccessItems.map((item) => (
                    <button
                      key={item.value}
                      onClick={() => handleRequestAccess(item.value)}
                      className="w-full text-left text-white/70 hover:text-white transition-colors duration-300 text-base font-medium py-2 px-6 rounded-lg hover:bg-white/5 cursor-pointer"
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              )}
              {isAuthenticated ? (
                <button
                  onClick={() => {
                    navigate('/dashboard')
                    setIsMenuOpen(false)
                  }}
                  className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-primary-start to-primary-end text-white rounded-lg hover:from-primary-end hover:to-primary-start transition-all duration-300"
                >
                  <User className="w-4 h-4" />
                  <span>Get Started</span>
                </button>
              ) : (
                <button
                  onClick={() => {
                    navigate('/auth')
                    setIsMenuOpen(false)
                  }}
                  className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-primary-start to-primary-end text-white rounded-lg hover:from-primary-end hover:to-primary-start transition-all duration-300"
                >
                  <User className="w-4 h-4" />
                  <span>Sign In</span>
                </button>
              )}
            </div>
          </nav>
        )}
      </div>
      

    </header>
  )
}

export default Header 