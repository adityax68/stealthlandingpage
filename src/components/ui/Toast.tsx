import React, { useEffect, useState } from 'react'

interface ToastProps {
  message: string
  type: 'success' | 'error'
  onClose: () => void
  duration?: number
}

const Toast: React.FC<ToastProps> = ({ message, type, onClose, duration = 4000 }) => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Show toast
    const showTimer = setTimeout(() => setIsVisible(true), 100)
    
    // Hide toast
    const hideTimer = setTimeout(() => {
      setIsVisible(false)
      setTimeout(onClose, 500)
    }, duration)

    return () => {
      clearTimeout(showTimer)
      clearTimeout(hideTimer)
    }
  }, [duration, onClose])

  const icon = type === 'success' ? '✓' : '✕'

  return (
    <div
      className={`bg-white border rounded-lg shadow-lg p-4 transition-all duration-500 transform ${
        isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
      } ${type === 'success' ? 'border-green-300 bg-green-50' : 'border-red-300 bg-red-50'}`}
      style={{ 
        minWidth: '320px',
        maxWidth: '400px',
        position: 'relative'
      }}
    >
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold ${
            type === 'success' 
              ? 'bg-green-500 text-white' 
              : 'bg-red-500 text-white'
          }`}>
            {icon}
          </div>
        </div>
        <div className="ml-3 flex-1">
          <p className={`text-sm font-medium ${
            type === 'success' ? 'text-green-800' : 'text-red-800'
          }`}>
            {message}
          </p>
        </div>
        <div className="ml-4 flex-shrink-0">
          <button
            onClick={() => {
              setIsVisible(false)
              setTimeout(onClose, 500)
            }}
            className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}

export default Toast