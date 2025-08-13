import React from 'react'
import type { ButtonVariant, ButtonSize } from '../../config/ui'

interface ButtonProps {
  children: React.ReactNode
  variant?: ButtonVariant
  size?: ButtonSize
  className?: string
  onClick?: () => void
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  onClick,
  disabled = false,
  type = 'button'
}) => {
  const baseClasses = 'relative inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-primary-start disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden group'
  
  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
    xl: 'px-10 py-5 text-xl'
  }
  
  const variantClasses = {
    primary: 'bg-black text-white border-0',
    secondary: 'bg-black text-white border-0',
    outline: 'bg-black text-white border-0',
    ghost: 'bg-transparent text-white border-0'
  }

  // Animated luminous border effect
  const luminousBorderClasses = `
    before:absolute before:inset-0 before:rounded-xl before:p-[2px] before:bg-gradient-to-r 
    before:from-primary-start before:via-secondary-start before:to-accent-start 
    before:animate-spin-slow before:opacity-0 before:group-hover:opacity-100 
    before:transition-opacity before:duration-500 before:z-0
    after:absolute after:inset-[2px] after:rounded-xl after:bg-black after:z-10
  `

  // Shimmer effect wrapper
  const shimmerWrapper = (
    <div className="relative">
      {/* Shimmer Border Effect */}
      <div className="absolute inset-0 rounded-xl p-[2px] bg-gradient-to-r from-primary-start via-secondary-start to-accent-start opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <div className="w-full h-full rounded-xl bg-gradient-to-r from-primary-start via-secondary-start to-accent-start animate-pulse"></div>
      </div>
      
      {/* Main Button Content */}
      <button
        type={type}
        className={`
          ${baseClasses} 
          ${sizeClasses[size]} 
          ${variantClasses[variant]} 
          ${luminousBorderClasses}
          ${className}
        `}
        onClick={onClick}
        disabled={disabled}
      >
        <span className="relative z-20 bg-gradient-to-r from-primary-start via-secondary-start to-accent-start bg-clip-text text-transparent group-hover:from-primary-end group-hover:via-secondary-end group-hover:to-accent-end transition-all duration-500">
          {children}
        </span>
      </button>
    </div>
  )

  return shimmerWrapper
}

export default Button 