import React, { useState } from 'react'
import { Menu, X, User } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

interface HeaderProps {
  isAuthenticated?: boolean
}

const Header: React.FC<HeaderProps> = ({ isAuthenticated = false }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const navigate = useNavigate()

  const navItems = [
    { label: 'Home', href: '#home' },
    { label: 'About', href: '#home' },
    { label: 'Features', href: '#features' },
    { label: 'Products', href: '#home' },
    { label: 'Contact', href: '#home' }
  ]

  const handleLinkClick = (href: string) => {
    setIsMenuOpen(false)
    if (href === '#features') {
      document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })
    } else {
      // Scroll to the Coming Soon section in the hero
      const heroSection = document.querySelector('section')
      if (heroSection) {
        heroSection.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-xl border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-r from-primary-start to-primary-end rounded-lg flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-sm md:text-base">MD</span>
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