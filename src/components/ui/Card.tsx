import React from 'react'
import type { CardVariant } from '../../config/ui'

interface CardProps {
  children: React.ReactNode
  variant?: CardVariant
  className?: string
  onClick?: () => void
}

const Card: React.FC<CardProps> = ({
  children,
  variant = 'elevated',
  className = '',
  onClick
}) => {
  const baseClasses = 'transition-all duration-300 ease-in-out transform perspective-1000'
  
  const variantClasses = {
    elevated: 'bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl shadow-black/25 rounded-3xl hover:shadow-3xl hover:shadow-black/30',
    glass: 'bg-white/5 backdrop-blur-md border border-white/10 shadow-lg shadow-black/10 rounded-2xl',
    gradient: 'bg-gradient-to-br from-primary-start/10 to-primary-end/10 border border-primary-start/20 shadow-xl shadow-primary-start/15 rounded-3xl'
  }
  
  const interactiveClasses = onClick ? 'cursor-pointer hover:scale-105' : ''
  
  const classes = [
    baseClasses,
    variantClasses[variant],
    interactiveClasses,
    className
  ].join(' ')

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!onClick) return
    
    const card = e.currentTarget
    const rect = card.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    
    const centerX = rect.width / 2
    const centerY = rect.height / 2
    
    const rotateX = (y - centerY) / 20
    const rotateY = (centerX - x) / 20
    
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`
  }

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!onClick) return
    e.currentTarget.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)'
  }

  return (
    <div
      className={classes}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </div>
  )
}

export default Card 