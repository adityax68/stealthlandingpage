import React, { useState, useEffect } from 'react'
import Button from './ui/Button'

const Hero: React.FC = () => {
  const [visibleLetters, setVisibleLetters] = useState(0)
  const [isGlowing, setIsGlowing] = useState(false)
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

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-black via-gray-900 to-black pt-20">
      {/* Background Orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 left-10 w-48 h-48 md:top-20 md:left-20 md:w-72 md:h-72 bg-gradient-to-br from-primary-start/20 to-primary-end/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-10 right-10 w-64 h-64 md:bottom-20 md:right-20 md:w-96 md:h-96 bg-gradient-to-br from-secondary-start/20 to-secondary-end/20 rounded-full blur-3xl animate-float-delayed"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-56 h-56 md:w-80 md:h-80 bg-gradient-to-br from-accent-start/15 to-accent-end/15 rounded-full blur-3xl animate-pulse-slow"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="mb-8 md:mb-12">
          <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl xl:text-9xl font-bold mb-6 md:mb-8">
            <span className="block gradient-text">Your AI Doc</span>
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

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center items-center px-4">
          <Button 
            variant="primary" 
            size="lg"
            className="w-full sm:w-auto min-w-[200px]"
          >
            Join Waitlist
          </Button>
          <Button 
            variant="outline" 
            size="lg"
            className="w-full sm:w-auto min-w-[200px]"
          >
            Learn More
          </Button>
        </div>

        {/* Stats */}
        <div className="mt-12 md:mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-8 max-w-4xl mx-auto px-4">
          <div className="text-center">
            <div className="text-3xl sm:text-4xl md:text-5xl font-bold gradient-text mb-2">99%</div>
            <div className="text-white/70 text-sm sm:text-lg">Accuracy Rate</div>
          </div>
          <div className="text-center">
            <div className="text-3xl sm:text-4xl md:text-5xl font-bold gradient-text mb-2">24/7</div>
            <div className="text-white/70 text-sm sm:text-lg">Available Support</div>
          </div>
          <div className="text-center">
            <div className="text-3xl sm:text-4xl md:text-5xl font-bold gradient-text mb-2">10K+</div>
            <div className="text-white/70 text-sm sm:text-lg">Users Helped</div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero 