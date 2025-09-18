import React, { useState, useEffect, useRef } from 'react'

interface VideoSplashScreenProps {
  onComplete: () => void
}

const VideoSplashScreen: React.FC<VideoSplashScreenProps> = ({ onComplete }) => {
  const [isVideoLoaded, setIsVideoLoaded] = useState(false)
  const [showText, setShowText] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    // Show text after a short delay
    const textTimer = setTimeout(() => {
      setShowText(true)
    }, 1000)

    // Complete the splash screen after 5 seconds
    const completeTimer = setTimeout(() => {
      onComplete()
    }, 5000)

    return () => {
      clearTimeout(textTimer)
      clearTimeout(completeTimer)
    }
  }, [onComplete])

  const handleVideoLoad = () => {
    setIsVideoLoaded(true)
    if (videoRef.current) {
      videoRef.current.play().catch(console.error)
    }
  }

  const handleVideoError = () => {
    console.error('Video failed to load')
    // If video fails to load, still complete after 5 seconds
    setTimeout(() => {
      onComplete()
    }, 5000)
  }

  return (
    <div className="fixed inset-0 z-50 bg-black flex items-center justify-center overflow-hidden">
      {/* Video Background */}
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover"
        onLoadedData={handleVideoLoad}
        onError={handleVideoError}
        muted
        playsInline
        autoPlay
      >
        <source src="/landing.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Loading indicator while video loads */}
      {!isVideoLoaded && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
        </div>
      )}

      {/* Text Overlay */}
      <div className="relative z-10 w-full h-full flex items-end justify-center pb-16">
        <div className={`text-center transition-all duration-1000 ${
          showText 
            ? 'opacity-100 transform translate-y-0' 
            : 'opacity-0 transform translate-y-8'
        }`}>
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-4 drop-shadow-2xl">
            Your pocket psychologist
          </h1>
          <div className="w-24 h-1 bg-white mx-auto rounded-full"></div>
        </div>
      </div>

      {/* Fade out overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none"></div>
    </div>
  )
}

export default VideoSplashScreen
