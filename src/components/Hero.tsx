import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { User } from 'lucide-react'
import MoodAssessment from './MoodAssessment'
import { useMood } from '../contexts/MoodContext'

interface Ripple {
  id: number
  x: number
  y: number
}

interface HeroProps {
  isAuthenticated?: boolean
}

const Hero: React.FC<HeroProps> = ({ isAuthenticated = false }) => {
  const navigate = useNavigate()
  const [isGlowing, setIsGlowing] = useState(false)
  const [ripples, setRipples] = useState<Ripple[]>([])
  const [showMoodAssessment, setShowMoodAssessment] = useState(false)
  const [, setHasShownMoodAssessment] = useState(false)
  const [isVideoLoaded, setIsVideoLoaded] = useState(false)
  const heroRef = useRef<HTMLElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const rippleId = useRef(0)
  const { setMoodData } = useMood()

  useEffect(() => {
    // Start glow animation immediately
    const glowTimer = setTimeout(() => {
      setIsGlowing(true)
    }, 500)

    return () => {
      clearTimeout(glowTimer)
    }
  }, [])

  // Ensure video plays when component mounts
  useEffect(() => {
    if (videoRef.current && isVideoLoaded) {
      videoRef.current.play().catch(console.error)
    }
  }, [isVideoLoaded])

  // Auto-show mood assessment for new sessions
  useEffect(() => {
    const hasShownBefore = sessionStorage.getItem('hasShownMoodAssessment')
    
    // Show mood assessment if not shown before in this session
    if (!hasShownBefore) {
      const moodTimer = setTimeout(() => {
        setShowMoodAssessment(true)
        setHasShownMoodAssessment(true)
        sessionStorage.setItem('hasShownMoodAssessment', 'true')
      }, 2000) // Show after 2 seconds to let the page load

      return () => {
        clearTimeout(moodTimer)
      }
    }
  }, [])

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (!heroRef.current) return
    
    const rect = heroRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    
    const newRipple = {
      id: rippleId.current++,
      x,
      y
    }
    
    setRipples(prev => [...prev, newRipple])
    
    // Remove ripple after animation completes
    setTimeout(() => {
      setRipples(prev => prev.filter(ripple => ripple.id !== newRipple.id))
    }, 1500)
  }

  const handleMoodAssessmentComplete = useCallback((mood: string, reason: string) => {
    setMoodData(mood, reason)
    setShowMoodAssessment(false)
    
    // For both authenticated and guest users, SessionChatBot will automatically detect moodData change and open
    // No need to redirect to login - users can chat immediately
  }, [setMoodData])

  const handleMoodAssessmentSkip = useCallback(() => {
    setShowMoodAssessment(false)
  }, [])

  const handleVideoLoad = () => {
    console.log('Video loaded successfully')
    setIsVideoLoaded(true)
    if (videoRef.current) {
      videoRef.current.play().catch((error) => {
        console.error('Video play failed:', error)
      })
    }
  }

  const handleVideoError = () => {
    console.error('Video failed to load')
    setIsVideoLoaded(false)
  }

  return (
    <section 
      ref={heroRef}
      onMouseMove={handleMouseMove}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-white via-gray-50 to-gray-100 pt-20"
    >
      {/* Background Video */}
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover"
        style={{ 
          zIndex: 1,
          opacity: 0.3,
          filter: 'blur(2px)'
        }}
        onLoadedData={handleVideoLoad}
        onError={handleVideoError}
        onCanPlay={() => console.log('Video can play')}
        onLoadStart={() => console.log('Video load started')}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
      >
        <source src="/landing.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      
      {/* Video Overlay for better text readability */}
      <div className="absolute inset-0 bg-white/20" style={{ zIndex: 2 }}></div>
      {/* Video Loading Indicator */}
      {!isVideoLoaded && (
        <div className="absolute inset-0 flex items-center justify-center" style={{ zIndex: -8 }}>
          <div className="w-8 h-8 border-2 border-primary-start/30 border-t-primary-start rounded-full animate-spin"></div>
        </div>
      )}

      {/* Enhanced Background Orbs with Multiple Floating Layers */}
      <div className="absolute inset-0 overflow-hidden" style={{ zIndex: 3 }}>
        {/* Primary Floating Orbs */}
        <div className="absolute top-10 left-10 w-48 h-48 md:top-20 md:left-20 md:w-72 md:h-72 bg-gradient-to-br from-primary-start/20 to-primary-end/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-10 right-10 w-64 h-64 md:bottom-20 md:right-20 md:w-96 md:h-96 bg-gradient-to-br from-secondary-start/20 to-secondary-end/20 rounded-full blur-3xl animate-float-delayed"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-56 h-56 md:w-80 md:h-80 bg-gradient-to-br from-accent-start/15 to-accent-end/15 rounded-full blur-3xl animate-pulse-slow"></div>
        
        {/* Additional Floating Elements */}
        <div className="absolute top-1/4 right-1/4 w-32 h-32 md:w-40 md:h-40 bg-gradient-to-br from-primary-start/10 to-accent-start/10 rounded-full blur-2xl animate-float-slow"></div>
        <div className="absolute bottom-1/4 left-1/4 w-24 h-24 md:w-32 md:h-32 bg-gradient-to-br from-secondary-start/15 to-primary-end/15 rounded-full blur-2xl animate-float-delayed"></div>
        <div className="absolute top-3/4 left-1/3 w-20 h-20 md:w-28 md:h-28 bg-gradient-to-br from-accent-start/20 to-secondary-start/20 rounded-full blur-xl animate-float"></div>
        
        {/* Water Flow Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-start/5 via-transparent to-accent-start/5 animate-water-flow"></div>
      </div>

      {/* Interactive Ripple Effects */}
      {ripples.map((ripple) => (
        <div
          key={ripple.id}
          className="absolute w-4 h-4 bg-gradient-to-r from-primary-start/40 to-accent-start/40 rounded-full pointer-events-none animate-waterRipple"
          style={{
            left: ripple.x - 8,
            top: ripple.y - 8,
            zIndex: 15,
          }}
        />
      ))}

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center" style={{ zIndex: 10 }}>
        <div className="mb-8 md:mb-12">
          <h1 className="text-5xl sm:text-6xl md:text-8xl lg:text-9xl xl:text-[10rem] font-bold mb-6 md:mb-8">
            <span className="block text-gray-800 rubik-pixels-regular">Mind Acuity</span>
          </h1>
          
          <p className="text-lg sm:text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto mb-12 md:mb-16 leading-relaxed px-4">
            Advanced AI-powered assessment and personalized solutions for stress, anxiety, and depression. 
            Experience the future of mental health care.
          </p>
        </div>

        {/* Enhanced Launch Status Animation */}
        <div className="mb-12 md:mb-16 relative px-4">
          {/* Background Glow Effect */}
          <div className={`absolute inset-0 bg-gradient-to-r from-primary-start/10 via-secondary-start/10 to-accent-start/10 rounded-2xl md:rounded-3xl blur-3xl transition-all duration-1000 ${
            isGlowing ? 'opacity-100 scale-110' : 'opacity-0 scale-100'
          }`}></div>
          
          {/* Main Container */}
          <div className="relative bg-gradient-to-br from-white/90 via-white/70 to-white/50 backdrop-blur-xl border border-primary-start/20 rounded-2xl md:rounded-3xl p-6 md:p-8 lg:p-12 shadow-2xl">
            {/* Subtle Border Animation */}
            <div className="absolute inset-0 rounded-2xl md:rounded-3xl bg-gradient-to-r from-primary-start/20 via-secondary-start/20 to-accent-start/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            {/* Launch Text - Multi-line Layout */}
            <div className="flex justify-center items-center">
              <div className="relative group text-center">
                {/* Main Text with Enhanced Styling */}
                <div className="relative">
                  {/* Line 1: "Launched" - Large */}
                  <div className="relative">
                    <span className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-wider bg-gradient-to-r from-primary-start via-secondary-start to-accent-start bg-clip-text text-transparent drop-shadow-2xl transform group-hover:scale-105 transition-all duration-500 block" style={{ fontFamily: '"Courier New", Courier, monospace' }}>
                      Launched
                    </span>
                  </div>
                  
                  {/* Line 2: "on" - Smaller */}
                  <div className="relative mt-1">
                    <span className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-medium tracking-wide bg-gradient-to-r from-primary-start/80 via-secondary-start/80 to-accent-start/80 bg-clip-text text-transparent drop-shadow-xl transform group-hover:scale-105 transition-all duration-500 block" style={{ fontFamily: '"Courier New", Courier, monospace' }}>
                      on
                    </span>
                  </div>
                  
                  {/* Line 3: "2nd October" - Same size as Launched */}
                  <div className="relative mt-2">
                    <span className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-wider bg-gradient-to-r from-primary-start via-secondary-start to-accent-start bg-clip-text text-transparent drop-shadow-2xl transform group-hover:scale-105 transition-all duration-500 block" style={{ fontFamily: '"Courier New", Courier, monospace' }}>
                      2nd October
                    </span>
                  </div>
                  
                  {/* Line 4: "2025" - Smaller */}
                  <div className="relative mt-1">
                    <span className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-medium tracking-wide bg-gradient-to-r from-primary-start/80 via-secondary-start/80 to-accent-start/80 bg-clip-text text-transparent drop-shadow-xl transform group-hover:scale-105 transition-all duration-500 block" style={{ fontFamily: '"Courier New", Courier, monospace' }}>
                      2025
                    </span>
                  </div>
                  
                  {/* Animated Background Glow */}
                  <div className={`absolute -inset-4 bg-gradient-to-r from-primary-start/30 via-secondary-start/30 to-accent-start/30 blur-3xl transition-all duration-1000 ${
                    isGlowing ? 'opacity-100 scale-110' : 'opacity-0 scale-100'
                  }`}></div>
                  
                  {/* Pulsing Border Effect */}
                  <div className="absolute -inset-2 bg-gradient-to-r from-primary-start/20 via-secondary-start/20 to-accent-start/20 rounded-lg blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-pulse"></div>
                </div>
                
                {/* Floating Particles Effect */}
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute top-0 left-1/4 w-1 h-1 bg-primary-start rounded-full animate-ping opacity-60" style={{ animationDelay: '0s' }}></div>
                  <div className="absolute top-1/4 right-1/4 w-1 h-1 bg-secondary-start rounded-full animate-ping opacity-60" style={{ animationDelay: '1s' }}></div>
                  <div className="absolute bottom-1/4 left-1/3 w-1 h-1 bg-accent-start rounded-full animate-ping opacity-60" style={{ animationDelay: '2s' }}></div>
                  <div className="absolute bottom-0 right-1/3 w-1 h-1 bg-primary-start rounded-full animate-ping opacity-60" style={{ animationDelay: '0.5s' }}></div>
                </div>
                
              </div>
            </div>
            
            {/* Subtitle */}
            <div className={`mt-4 md:mt-6 transition-all duration-1000 delay-1000 ${
              isGlowing ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-4'
            }`}>
              <p className="text-gray-600 text-base sm:text-lg md:text-xl font-light px-2">
                Experience the future of mental health technology
              </p>
            </div>
            
            {/* Progress Indicator */}
            <div className={`mt-6 md:mt-8 transition-all duration-1000 delay-1500 ${
              isGlowing ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-4'
            }`}>
              <div className="flex items-center justify-center space-x-2">
                <div className="w-2 h-2 bg-primary-start rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-secondary-start rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-accent-start rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>

            {/* Sign In Button - Only show when not authenticated */}
            {!isAuthenticated && (
              <div className={`mt-8 md:mt-10 transition-all duration-1000 delay-2000 ${
                isGlowing ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-4'
              }`}>
                <button
                  onClick={() => navigate('/auth')}
                  className="group relative overflow-hidden bg-gradient-to-r from-primary-start to-primary-end hover:from-primary-start/90 hover:to-primary-end/90 text-white px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-primary-start/25 flex items-center space-x-3 mx-auto"
                >
                  <div className="relative z-10 flex items-center space-x-3">
                    <User className="w-6 h-6" />
                    <span>Sign Up to Get Started</span>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                </button>
              </div>
            )}

          </div>
        </div>

        {/* Floating Stats with Enhanced Animations */}
        <div className="mt-12 md:mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-8 max-w-4xl mx-auto px-4">
          <div className="text-center group hover:scale-105 transition-transform duration-300">
            <div className="relative">
              <div className="text-3xl sm:text-4xl md:text-5xl font-bold gradient-text mb-2 animate-glow-pulse">99%</div>
              <div className="absolute inset-0 bg-gradient-to-r from-primary-start/20 to-primary-end/20 blur-xl rounded-full animate-float"></div>
            </div>
            <div className="text-gray-600 text-sm sm:text-lg">Accuracy Rate</div>
          </div>
          <div className="text-center group hover:scale-105 transition-transform duration-300">
            <div className="relative">
              <div className="text-3xl sm:text-4xl md:text-5xl font-bold gradient-text mb-2 animate-glow-pulse" style={{ animationDelay: '0.5s' }}>24/7</div>
              <div className="absolute inset-0 bg-gradient-to-r from-secondary-start/20 to-secondary-end/20 blur-xl rounded-full animate-float-delayed"></div>
            </div>
            <div className="text-gray-600 text-sm sm:text-lg">Available Support</div>
          </div>
          <div className="text-center group hover:scale-105 transition-transform duration-300">
            <div className="relative">
              <div className="text-3xl sm:text-4xl md:text-5xl font-bold gradient-text mb-2 animate-glow-pulse" style={{ animationDelay: '1s' }}>10K+</div>
              <div className="absolute inset-0 bg-gradient-to-r from-accent-start/20 to-accent-end/20 blur-xl rounded-full animate-float-slow"></div>
            </div>
            <div className="text-gray-600 text-sm sm:text-lg">Users Helped</div>
          </div>
        </div>
      </div>


      {/* Mood Assessment Modal */}
      <MoodAssessment
        isVisible={showMoodAssessment}
        onComplete={handleMoodAssessmentComplete}
        onSkip={handleMoodAssessmentSkip}
      />
    </section>
  )
}

export default Hero 