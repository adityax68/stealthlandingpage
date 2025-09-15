import React, { useState, useEffect } from 'react'

interface SplashScreenProps {
  onComplete: () => void
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [loadingText, setLoadingText] = useState('your pocket psychologist')
  const [showContent, setShowContent] = useState(false)

  useEffect(() => {
    // Show content after a brief delay
    const showTimer = setTimeout(() => {
      setShowContent(true)
    }, 500)

    // Loading text animation
    const textTimer = setInterval(() => {
      setLoadingText(prev => {
        if (prev === 'your pocket psychologist') return 'your pocket psychologist.'
        if (prev === 'your pocket psychologist.') return 'your pocket psychologist..'
        if (prev === 'your pocket psychologist..') return 'your pocket psychologist...'
        return 'your pocket psychologist'
      })
    }, 300)

    // Complete splash screen after 2 seconds
    const completeTimer = setTimeout(() => {
      onComplete()
    }, 2000)

    return () => {
      clearTimeout(showTimer)
      clearInterval(textTimer)
      clearTimeout(completeTimer)
    }
  }, [onComplete])

  return (
    <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
      <div className={`transition-all duration-1000 flex flex-col items-center justify-center ${showContent ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
        {/* Loading Text - Centered */}
        <div className="text-center">
          <h2 className="text-white/90 text-2xl md:text-4xl font-mono font-bold mb-4 tracking-wider">
            {loadingText}
          </h2>
        </div>
      </div>
    </div>
  )
}

export default SplashScreen 