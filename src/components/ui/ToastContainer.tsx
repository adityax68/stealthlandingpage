import React from 'react'
import Toast from './Toast'
import { useToast } from '../../contexts/ToastContext'

const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useToast()



  return (
    <div className="fixed top-6 right-6 z-50 space-y-3">
      {toasts.map((toast, index) => (
        <div
          key={toast.id}
          className="transform transition-all duration-300"
          style={{
            transform: `translateX(${index * 20}px)`,
            zIndex: 1000 - index
          }}
        >
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => removeToast(toast.id)}
          />
        </div>
      ))}
    </div>
  )
}

export default ToastContainer 