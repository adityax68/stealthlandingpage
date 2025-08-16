import React, { useState, useEffect, useRef } from 'react'

interface Ripple {
  id: number
  x: number
  y: number
}

const Hero: React.FC = () => {
  const [visibleLetters, setVisibleLetters] = useState(0)
  const [isGlowing, setIsGlowing] = useState(false)
  const [ripples, setRipples] = useState<Ripple[]>([])
  const heroRef = useRef<HTMLElement>(null)
  const rippleId = useRef(0)
  const comingSoonText = "Coming Soon"

  useEffect(() => {
    const timer = setInterval(() => {
      setVisibleLetters(prev => {
        if (prev < comingSoonText.length) {
          return prev + 1
        }
        return prev
      })
    }, 200)

    // Start glow animation after all letters are visible
    const glowTimer = setTimeout(() => {
      setIsGlowing(true)
    }, comingSoonText.length * 200 + 500)

    return () => {
      clearInterval(timer)
      clearTimeout(glowTimer)
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

  return (
    <section 
      ref={heroRef}
      onMouseMove={handleMouseMove}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-black via-gray-900 to-black pt-20"
    >
      {/* Enhanced Background Orbs with Multiple Floating Layers */}
      <div className="absolute inset-0 overflow-hidden">
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
          }}
        />
      ))}

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="mb-8 md:mb-12">
          <h1 className="text-5xl sm:text-6xl md:text-8xl lg:text-9xl xl:text-[10rem] font-bold mb-6 md:mb-8">
            <span className="block text-white rubik-pixels-regular">Mind Acuity</span>
          </h1>
          
          <p className="text-lg sm:text-xl md:text-2xl text-white/70 max-w-4xl mx-auto mb-12 md:mb-16 leading-relaxed px-4">
            Advanced AI-powered assessment and personalized solutions for stress, anxiety, and depression. 
            Experience the future of mental health care.
          </p>
        </div>

        {/* Enhanced Coming Soon Animation */}
        <div className="mb-12 md:mb-16 relative px-4">
          {/* Background Glow Effect */}
          <div className={`absolute inset-0 bg-gradient-to-r from-primary-start/10 via-secondary-start/10 to-accent-start/10 rounded-2xl md:rounded-3xl blur-3xl transition-all duration-1000 ${
            isGlowing ? 'opacity-100 scale-110' : 'opacity-0 scale-100'
          }`}></div>
          
          {/* Main Container */}
          <div className="relative bg-gradient-to-br from-black/40 via-black/20 to-transparent backdrop-blur-xl border border-white/10 rounded-2xl md:rounded-3xl p-6 md:p-8 lg:p-12 shadow-2xl">
            {/* Subtle Border Animation */}
            <div className="absolute inset-0 rounded-2xl md:rounded-3xl bg-gradient-to-r from-primary-start/20 via-secondary-start/20 to-accent-start/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            {/* Coming Soon Text */}
            <div className="flex justify-center items-center space-x-1 md:space-x-2">
              {comingSoonText.split('').map((letter, index) => (
                <div
                  key={index}
                  className={`relative transition-all duration-700 ${
                    index < visibleLetters 
                      ? 'opacity-100 transform translate-y-0 scale-100' 
                      : 'opacity-0 transform translate-y-10 scale-50'
                  }`}
                  style={{
                    transitionDelay: `${index * 150}ms`
                  }}
                >
                  <span className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl xl:text-8xl font-bold bg-gradient-to-r from-primary-start via-secondary-start to-accent-start bg-clip-text text-transparent drop-shadow-lg">
                    {letter === ' ' ? '\u00A0' : letter}
                  </span>
                  
                  {/* Individual Letter Glow */}
                  <div className={`absolute inset-0 bg-gradient-to-r from-primary-start/30 via-secondary-start/30 to-accent-start/30 blur-xl transition-all duration-1000 ${
                    isGlowing ? 'opacity-100 scale-110' : 'opacity-0 scale-100'
                  }`}></div>
                </div>
              ))}
            </div>
            
            {/* Subtitle */}
            <div className={`mt-4 md:mt-6 transition-all duration-1000 delay-1000 ${
              isGlowing ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-4'
            }`}>
              <p className="text-white/60 text-base sm:text-lg md:text-xl font-light px-2">
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
          </div>
        </div>

        {/* Floating Stats with Enhanced Animations */}
        <div className="mt-12 md:mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-8 max-w-4xl mx-auto px-4">
          <div className="text-center group hover:scale-105 transition-transform duration-300">
            <div className="relative">
              <div className="text-3xl sm:text-4xl md:text-5xl font-bold gradient-text mb-2 animate-glow-pulse">99%</div>
              <div className="absolute inset-0 bg-gradient-to-r from-primary-start/20 to-primary-end/20 blur-xl rounded-full animate-float"></div>
            </div>
            <div className="text-white/70 text-sm sm:text-lg">Accuracy Rate</div>
          </div>
          <div className="text-center group hover:scale-105 transition-transform duration-300">
            <div className="relative">
              <div className="text-3xl sm:text-4xl md:text-5xl font-bold gradient-text mb-2 animate-glow-pulse" style={{ animationDelay: '0.5s' }}>24/7</div>
              <div className="absolute inset-0 bg-gradient-to-r from-secondary-start/20 to-secondary-end/20 blur-xl rounded-full animate-float-delayed"></div>
            </div>
            <div className="text-white/70 text-sm sm:text-lg">Available Support</div>
          </div>
          <div className="text-center group hover:scale-105 transition-transform duration-300">
            <div className="relative">
              <div className="text-3xl sm:text-4xl md:text-5xl font-bold gradient-text mb-2 animate-glow-pulse" style={{ animationDelay: '1s' }}>10K+</div>
              <div className="absolute inset-0 bg-gradient-to-r from-accent-start/20 to-accent-end/20 blur-xl rounded-full animate-float-slow"></div>
            </div>
            <div className="text-white/70 text-sm sm:text-lg">Users Helped</div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero 