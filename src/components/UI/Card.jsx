import React from 'react'

const Card = ({
  children,
  className = '',
  hover = false,
  onClick,
  variant = 'default',
  ...props
}) => {
  const variants = {
    default: 'bg-navy-700 border border-navy-600',
    glass: 'bg-navy-700/80 backdrop-blur-md border border-white/10',
    gradient: 'bg-gradient-to-br from-navy-700 to-navy-800 border border-navy-600',
    gold: 'bg-navy-700 border border-gold-500/30'
  }

  const baseClasses = `rounded-lg shadow-lg p-6 ${variants[variant]}`
  const hoverClasses = hover ? 'hover:shadow-xl hover:scale-[1.02] hover:border-gold-500/50 transition-all duration-300 cursor-pointer' : ''
  const clickableClasses = onClick ? 'cursor-pointer' : ''
  
  const classes = `${baseClasses} ${hoverClasses} ${clickableClasses} ${className}`
  
  return (
    <div
      className={classes}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  )
}

export default Card
