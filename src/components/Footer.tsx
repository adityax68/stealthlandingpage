import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Mail, Linkedin } from 'lucide-react'

const Footer: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()

  const handleLinkClick = (href: string) => {
    // If we're not on the home page, navigate to home first then scroll
    if (location.pathname !== '/') {
      navigate('/')
      // Wait for navigation to complete, then scroll to the section
      setTimeout(() => {
        if (href === '#features') {
          document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })
        } else if (href === '#faq') {
          document.getElementById('faq')?.scrollIntoView({ behavior: 'smooth' })
        }
      }, 100)
      return
    }

    // If already on home page, just scroll
    if (href === '#features') {
      document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })
    } else if (href === '#faq') {
      document.getElementById('faq')?.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <footer id="footer" className="bg-gradient-to-br from-white/90 via-gray-50/80 to-white/90 border-t border-primary-start/20 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -right-20 w-40 h-40 md:w-80 md:h-80 bg-gradient-to-br from-primary-start/20 to-primary-end/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute -bottom-20 -left-20 w-40 h-40 md:w-80 md:h-80 bg-gradient-to-br from-secondary-start/20 to-secondary-end/20 rounded-full blur-3xl animate-float-delayed"></div>
      </div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-2 md:space-x-3 mb-4 md:mb-6">
              <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-r from-primary-start to-primary-end rounded-lg md:rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-sm md:text-base">MA</span>
              </div>
              <h3 className="text-xl md:text-2xl font-bold gradient-text">Mind Acuity</h3>
            </div>
            <p className="text-gray-600 mb-6 max-w-md leading-relaxed text-sm md:text-base">
              Revolutionizing mental health through AI-powered assessment, intelligent conversation, 
              and personalized solutions for stress, anxiety, and depression.
            </p>
            <div className="flex space-x-3 md:space-x-4">
              <a href="https://www.linkedin.com/company/mindacuity-ai/" target="_blank" rel="noopener noreferrer" className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-r from-blue-400/20 to-cyan-400/20 hover:from-blue-400/40 hover:to-cyan-400/40 border border-white/20 rounded-lg md:rounded-xl flex items-center justify-center text-gray-700 hover:text-blue-500 transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-blue-400/20">
                <Linkedin size={16} className="md:w-5 md:h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-base md:text-lg font-semibold text-gray-800 mb-4 md:mb-6">Quick Links</h4>
            <ul className="space-y-2 md:space-y-3">
              <li><a href="#features" onClick={(e) => { e.preventDefault(); handleLinkClick('#features'); }} className="text-gray-600 hover:text-gray-800 transition-colors duration-300 hover:translate-x-1 inline-block text-sm md:text-base cursor-pointer">Features</a></li>
              <li><a href="#faq" onClick={(e) => { e.preventDefault(); handleLinkClick('#faq'); }} className="text-gray-600 hover:text-gray-800 transition-colors duration-300 hover:translate-x-1 inline-block text-sm md:text-base cursor-pointer">FAQ</a></li>
              <li><button onClick={() => navigate('/privacy-policy')} className="text-gray-600 hover:text-gray-800 transition-colors duration-300 hover:translate-x-1 inline-block text-sm md:text-base cursor-pointer text-left">Privacy Policy</button></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-base md:text-lg font-semibold text-gray-800 mb-4 md:mb-6">Contact Info</h4>
            <ul className="space-y-3 md:space-y-4">
              <li className="flex items-start space-x-2 md:space-x-3">
                <div className="w-6 h-6 md:w-8 md:h-8 bg-gradient-to-r from-primary-start/20 to-primary-end/20 rounded-md md:rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Mail size={12} className="md:w-4 md:h-4 text-primary-start" />
                </div>
                <a href="mailto:business@thymositsolution.com" className="text-gray-600 hover:text-gray-800 transition-colors duration-300 text-sm md:text-base cursor-pointer">business@thymositsolution.com</a>
              </li>
             
            </ul>
          </div>
        </div>

        {/* Newsletter Signup */}
        {/* <div className="mt-12 md:mt-16 pt-6 md:pt-8 border-t border-white/10">
          <div className="max-w-md">
            <h4 className="text-base md:text-lg font-semibold text-white mb-3 md:mb-4">Stay Updated</h4>
            <p className="text-white/70 mb-4 text-sm md:text-base">Get the latest updates on our AI mental health platform.</p>
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="flex-1 px-3 md:px-4 py-2 md:py-3 bg-white/10 border border-white/20 rounded-lg md:rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-primary-start/50 focus:border-primary-start/50 transition-all duration-300 text-sm md:text-base"
              />
              <button className="px-4 md:px-6 py-2 md:py-3 bg-gradient-to-r from-primary-start to-primary-end hover:from-primary-end hover:to-primary-start text-white font-semibold rounded-lg md:rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary-start/20 text-sm md:text-base">
                Subscribe
              </button>
            </div>
          </div>
        </div> */}

        {/* Copyright */}
        <div className="mt-8 md:mt-12 pt-6 md:pt-8 border-t border-white/10 text-center">
          <p className="text-gray-600 text-xs md:text-sm">
            © 2025 MindAcuity (Thymos IT Solution Pvt. Ltd.). All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer 