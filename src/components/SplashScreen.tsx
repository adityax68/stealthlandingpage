import React, { useState, useEffect } from 'react'

interface SplashScreenProps {
  onComplete: () => void
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [batteryLevel, setBatteryLevel] = useState(0)
  const [loadingText, setLoadingText] = useState('Agent Loading')
  const [showContent, setShowContent] = useState(false)

  useEffect(() => {
    // Show content after a brief delay
    const showTimer = setTimeout(() => {
      setShowContent(true)
    }, 500)

    // Battery charging animation
    const batteryTimer = setInterval(() => {
      setBatteryLevel(prev => {
        if (prev >= 100) {
          clearInterval(batteryTimer)
          return 100
        }
        return prev + 2
      })
    }, 50)

    // Loading text animation
    const textTimer = setInterval(() => {
      setLoadingText(prev => {
        if (prev === 'Agent Loading') return 'Agent Loading.'
        if (prev === 'Agent Loading.') return 'Agent Loading..'
        if (prev === 'Agent Loading..') return 'Agent Loading...'
        return 'Agent Loading'
      })
    }, 300)

    // Complete splash screen after battery reaches 100%
    const completeTimer = setTimeout(() => {
      onComplete()
    }, 3000)

    return () => {
      clearTimeout(showTimer)
      clearInterval(batteryTimer)
      clearInterval(textTimer)
      clearTimeout(completeTimer)
    }
  }, [onComplete])

  return (
          <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
        <div className={`transition-all duration-1000 flex flex-col items-center justify-center ${showContent ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
          {/* Robotic Battery Container */}
          <div className="relative mb-8 flex flex-col items-center">
            {/* Battery Outline - More Angular/Robotic */}
            <div className="w-32 h-16 md:w-48 md:h-24 border-4 border-cyan-400/60 relative bg-black/50 backdrop-blur-sm">
              {/* Angular corners for robotic feel */}
              <div className="absolute top-0 left-0 w-2 h-2 bg-cyan-400/80"></div>
              <div className="absolute top-0 right-0 w-2 h-2 bg-cyan-400/80"></div>
              <div className="absolute bottom-0 left-0 w-2 h-2 bg-cyan-400/80"></div>
              <div className="absolute bottom-0 right-0 w-2 h-2 bg-cyan-400/80"></div>
              
              {/* Circuit pattern overlay */}
              <div className="absolute inset-0 opacity-20">
                <div className="absolute top-2 left-2 w-1 h-1 bg-cyan-400"></div>
                <div className="absolute top-2 right-2 w-1 h-1 bg-cyan-400"></div>
                <div className="absolute bottom-2 left-2 w-1 h-1 bg-cyan-400"></div>
                <div className="absolute bottom-2 right-2 w-1 h-1 bg-cyan-400"></div>
                <div className="absolute top-1/2 left-2 w-1 h-1 bg-cyan-400"></div>
                <div className="absolute top-1/2 right-2 w-1 h-1 bg-cyan-400"></div>
              </div>
              
              {/* Battery Terminal - More robotic */}
              <div className="absolute -right-3 top-1/2 transform -translate-y-1/2 w-3 h-10 md:h-14 bg-gradient-to-r from-cyan-400/40 to-cyan-600/60">
                <div className="absolute top-1 left-1 w-1 h-1 bg-cyan-400"></div>
                <div className="absolute bottom-1 left-1 w-1 h-1 bg-cyan-400"></div>
              </div>
              
              {/* Battery Fill - Cyberpunk style */}
              <div 
                className="h-full bg-gradient-to-r from-green-400 via-green-500 to-green-600 transition-all duration-300 ease-out relative overflow-hidden"
                style={{ width: `${batteryLevel}%` }}
              >
                {/* Circuit lines in fill */}
                <div className="absolute inset-0 opacity-30">
                  <div className="absolute top-1/4 left-0 w-full h-px bg-green-300/50"></div>
                  <div className="absolute top-3/4 left-0 w-full h-px bg-green-300/50"></div>
                  <div className="absolute top-0 left-1/3 w-px h-full bg-green-300/50"></div>
                  <div className="absolute top-0 left-2/3 w-px h-full bg-green-300/50"></div>
                </div>
                
                {/* Scanning line effect */}
                <div className="absolute top-0 left-0 w-full h-0.5 bg-green-300 animate-pulse"></div>
              </div>
              
              {/* Battery Level Text - Robotic font style */}
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-cyan-300 font-mono font-bold text-lg md:text-2xl drop-shadow-lg tracking-wider">
                  {batteryLevel}%
                </span>
              </div>
            </div>
            

            
            {/* Status indicators */}
            <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2">
              <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
            </div>
          </div>

          {/* Loading Text - Centered with battery */}
          <div className="text-center mb-8">
            <h2 className="text-cyan-300 text-xl md:text-2xl font-mono font-bold mb-2 tracking-wider">
              {loadingText}
            </h2>
            <p className="text-cyan-400/60 text-sm md:text-base font-mono">
              INITIALIZING AI DOC SYSTEM
            </p>
          </div>

          {/* Progress Bar - Centered with battery */}
          <div className="w-64 md:w-80">
            <div className="w-full bg-black/50 border border-green-400/30 h-2 relative">
              <div 
                className="bg-gradient-to-r from-green-400 via-green-500 to-green-600 h-full transition-all duration-300 ease-out relative overflow-hidden"
                style={{ width: `${batteryLevel}%` }}
              >
                {/* Scanning effect */}
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-green-300/50 to-transparent animate-pulse"></div>
              </div>
              {/* Progress markers */}
              <div className="absolute top-0 left-1/4 w-px h-full bg-green-400/30"></div>
              <div className="absolute top-0 left-1/2 w-px h-full bg-green-400/30"></div>
              <div className="absolute top-0 left-3/4 w-px h-full bg-green-400/30"></div>
            </div>
          </div>

        {/* Floating Particles */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-cyan-400/30 rounded-full animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${3 + Math.random() * 2}s`
              }}
            ></div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default SplashScreen 