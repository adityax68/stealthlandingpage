import React from 'react'
import { Brain, Mail, Phone, MapPin, Twitter, Facebook, Instagram, Linkedin, Github } from 'lucide-react'

const Footer: React.FC = () => {
  const handleLinkClick = (href: string) => {
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
    <footer className="bg-gradient-to-br from-black/80 via-black/60 to-black/80 border-t border-white/10 relative overflow-hidden">
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
                <Brain size={20} className="md:w-6 md:h-6 text-white drop-shadow-lg" />
              </div>
              <h3 className="text-xl md:text-2xl font-bold gradient-text">Mind Acuity</h3>
            </div>
            <p className="text-white/70 mb-6 max-w-md leading-relaxed text-sm md:text-base">
              Revolutionizing mental health through AI-powered assessment, intelligent conversation, 
              and personalized solutions for stress, anxiety, and depression.
            </p>
            <div className="flex space-x-3 md:space-x-4">
              <a href="#" className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-r from-primary-start/20 to-primary-end/20 hover:from-primary-start/40 hover:to-primary-end/40 border border-white/20 rounded-lg md:rounded-xl flex items-center justify-center text-white hover:text-primary-start transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-primary-start/20">
                <Twitter size={16} className="md:w-5 md:h-5" />
              </a>
              <a href="#" className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-r from-secondary-start/20 to-secondary-end/20 hover:from-secondary-start/40 hover:to-secondary-end/40 border border-white/20 rounded-lg md:rounded-xl flex items-center justify-center text-white hover:text-secondary-start transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-secondary-start/20">
                <Facebook size={16} className="md:w-5 md:h-5" />
              </a>
              <a href="#" className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-r from-accent-start/20 to-accent-end/20 hover:from-accent-start/40 hover:to-accent-end/40 border border-white/20 rounded-lg md:rounded-xl flex items-center justify-center text-white hover:text-accent-start transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-accent-start/20">
                <Instagram size={16} className="md:w-5 md:h-5" />
              </a>
              <a href="#" className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-r from-blue-400/20 to-cyan-400/20 hover:from-blue-400/40 hover:to-cyan-400/40 border border-white/20 rounded-lg md:rounded-xl flex items-center justify-center text-white hover:text-blue-400 transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-blue-400/20">
                <Linkedin size={16} className="md:w-5 md:h-5" />
              </a>
              <a href="#" className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-r from-green-400/20 to-teal-400/20 hover:from-green-400/40 hover:to-teal-400/40 border border-white/20 rounded-lg md:rounded-xl flex items-center justify-center text-white hover:text-green-400 transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-green-400/20">
                <Github size={16} className="md:w-5 md:h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-base md:text-lg font-semibold text-white mb-4 md:mb-6">Quick Links</h4>
            <ul className="space-y-2 md:space-y-3">
              <li><a href="#home" onClick={(e) => { e.preventDefault(); handleLinkClick('#home'); }} className="text-white/70 hover:text-white transition-colors duration-300 hover:translate-x-1 inline-block text-sm md:text-base cursor-pointer">Home</a></li>
              <li><a href="#home" onClick={(e) => { e.preventDefault(); handleLinkClick('#home'); }} className="text-white/70 hover:text-white transition-colors duration-300 hover:translate-x-1 inline-block text-sm md:text-base cursor-pointer">About</a></li>
              <li><a href="#features" onClick={(e) => { e.preventDefault(); handleLinkClick('#features'); }} className="text-white/70 hover:text-white transition-colors duration-300 hover:translate-x-1 inline-block text-sm md:text-base cursor-pointer">Features</a></li>
              <li><a href="#home" onClick={(e) => { e.preventDefault(); handleLinkClick('#home'); }} className="text-white/70 hover:text-white transition-colors duration-300 hover:translate-x-1 inline-block text-sm md:text-base cursor-pointer">Products</a></li>
              <li><a href="#home" onClick={(e) => { e.preventDefault(); handleLinkClick('#home'); }} className="text-white/70 hover:text-white transition-colors duration-300 hover:translate-x-1 inline-block text-sm md:text-base cursor-pointer">Contact</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-base md:text-lg font-semibold text-white mb-4 md:mb-6">Contact Info</h4>
            <ul className="space-y-3 md:space-y-4">
              <li className="flex items-center space-x-2 md:space-x-3">
                <div className="w-6 h-6 md:w-8 md:h-8 bg-gradient-to-r from-primary-start/20 to-primary-end/20 rounded-md md:rounded-lg flex items-center justify-center flex-shrink-0">
                  <Mail size={12} className="md:w-4 md:h-4 text-primary-start" />
                </div>
                <span className="text-white/70 text-sm md:text-base">hello@mindacuity.ai</span>
              </li>
              <li className="flex items-center space-x-2 md:space-x-3">
                <div className="w-6 h-6 md:w-8 md:h-8 bg-gradient-to-r from-secondary-start/20 to-secondary-end/20 rounded-md md:rounded-lg flex items-center justify-center flex-shrink-0">
                  <Phone size={12} className="md:w-4 md:h-4 text-secondary-start" />
                </div>
                <span className="text-white/70 text-sm md:text-base">+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center space-x-2 md:space-x-3">
                <div className="w-6 h-6 md:w-8 md:h-8 bg-gradient-to-r from-accent-start/20 to-accent-end/20 rounded-md md:rounded-lg flex items-center justify-center flex-shrink-0">
                  <MapPin size={12} className="md:w-4 md:h-4 text-accent-start" />
                </div>
                <span className="text-white/70 text-sm md:text-base">San Francisco, CA</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="mt-12 md:mt-16 pt-6 md:pt-8 border-t border-white/10">
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
        </div>

        {/* Copyright */}
        <div className="mt-8 md:mt-12 pt-6 md:pt-8 border-t border-white/10 text-center">
          <p className="text-white/50 text-xs md:text-sm">
            © 2024 Mind Acuity. All rights reserved. | 
            <a href="#home" onClick={(e) => { e.preventDefault(); handleLinkClick('#home'); }} className="text-white/70 hover:text-white transition-colors duration-300 ml-1 md:ml-2 cursor-pointer">Privacy Policy</a> | 
            <a href="#home" onClick={(e) => { e.preventDefault(); handleLinkClick('#home'); }} className="text-white/70 hover:text-white transition-colors duration-300 ml-1 md:ml-2 cursor-pointer">Terms of Service</a>
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer 