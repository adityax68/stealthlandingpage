import React, { useState } from 'react'
import { Menu, X, User } from 'lucide-react'
import { useNavigate, useLocation } from 'react-router-dom'

interface HeaderProps {
  isAuthenticated?: boolean
}

const Header: React.FC<HeaderProps> = ({ isAuthenticated = false }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  const navItems = [
    { label: 'Home', href: '/' },
    { label: 'About', href: '#home' },
    { label: 'Features', href: '#features' },
    { label: 'Researches', href: '/researches' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'Contact', href: '#footer' }
  ]

  const handleLinkClick = (href: string) => {
    setIsMenuOpen(false)
    
    // Handle direct navigation to home page
    if (href === '/') {
      navigate('/')
      return
    }
    
    // If we're not on the home page and trying to navigate to sections, go to home first
    if (location.pathname !== '/' && (href === '#home' || href === '#features' || href === '#pricing' || href === '#footer')) {
      navigate('/')
      // Wait for navigation to complete, then scroll to the section
      setTimeout(() => {
        if (href === '#features') {
          document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })
        } else if (href === '#pricing') {
          document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })
        } else if (href === '#footer') {
          document.getElementById('footer')?.scrollIntoView({ behavior: 'smooth' })
        } else if (href === '#home') {
          // Scroll to the top of the page
          window.scrollTo({ top: 0, behavior: 'smooth' })
        }
      }, 100)
      return
    }
    
    // Handle navigation when already on the home page
    if (href === '#features') {
      document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })
    } else if (href === '#pricing') {
      document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })
    } else if (href === '#footer') {
      document.getElementById('footer')?.scrollIntoView({ behavior: 'smooth' })
    } else if (href === '/researches') {
      navigate('/researches')
    } else if (href === '#home') {
      // Scroll to the top of the page
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }






  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-xl border-b border-primary-start/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <div 
            className="flex items-center space-x-2 cursor-pointer"
            onClick={() => navigate('/')}
          >
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
                className="text-gray-600 hover:text-gray-800 transition-colors duration-300 text-sm font-medium cursor-pointer"
              >
                {item.label}
              </a>
            ))}
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
                onClick={() => navigate('/login')}
                className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-primary-start to-primary-end text-white rounded-lg hover:from-primary-end hover:to-primary-start transition-all duration-300"
              >
                <User className="w-4 h-4" />
                <span>Sign In</span>
              </button>
            )}
          </nav>

          {/* Mobile Header Actions */}
          <div className="md:hidden flex items-center space-x-3">
            {/* Mobile Auth Button */}
            {isAuthenticated ? (
              <button
                onClick={() => navigate('/dashboard')}
                className="flex items-center space-x-1 px-3 py-1.5 bg-gradient-to-r from-primary-start to-primary-end text-white rounded-lg hover:from-primary-end hover:to-primary-start transition-all duration-300 text-sm"
              >
                <User className="w-4 h-4" />
                <span>Get Started</span>
              </button>
            ) : (
              <button
                onClick={() => navigate('/login')}
                className="flex items-center space-x-1 px-3 py-1.5 bg-gradient-to-r from-primary-start to-primary-end text-white rounded-lg hover:from-primary-end hover:to-primary-start transition-all duration-300 text-sm"
              >
                <User className="w-4 h-4" />
                <span>Sign In</span>
              </button>
            )}
            
            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="w-8 h-8 flex items-center justify-center text-gray-600 hover:text-primary-start transition-colors duration-300"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden py-4 border-t border-primary-start/20">
            <div className="flex flex-col space-y-3">
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={(e) => {
                    e.preventDefault()
                    handleLinkClick(item.href)
                  }}
                  className="text-gray-600 hover:text-gray-800 transition-colors duration-300 text-base font-medium py-2 px-3 rounded-lg hover:bg-primary-start/10 cursor-pointer"
                >
                  {item.label}
                </a>
              ))}
            </div>
          </nav>
        )}
      </div>
    </header>
  )
}

export default Header 