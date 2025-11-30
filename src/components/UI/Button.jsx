import React from 'react'

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  type = 'button',
  onClick,
  disabled = false,
  className = '',
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-navy-900'
  
  const variants = {
    primary: 'bg-gold-500 hover:bg-gold-400 text-navy-900 focus:ring-gold-500',
    secondary: 'bg-navy-700 hover:bg-navy-600 text-gray-100 focus:ring-navy-500 border border-navy-600',
    success: 'bg-emerald-600 hover:bg-emerald-500 text-white focus:ring-emerald-500',
    danger: 'bg-red-600 hover:bg-red-500 text-white focus:ring-red-500',
    outline: 'border-2 border-gold-500 text-gold-500 hover:bg-gold-500 hover:text-navy-900 focus:ring-gold-500',
    ghost: 'text-gray-300 hover:bg-navy-700 hover:text-white focus:ring-navy-500',
    gold: 'bg-gold-500 hover:bg-gold-400 text-navy-900 focus:ring-gold-500 font-bold',
    'outline-gold': 'border-2 border-gold-500 text-gold-500 hover:bg-gold-500/10 focus:ring-gold-500'
  }
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  }
  
  const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed' : ''
  
  const classes = `${baseClasses} ${variants[variant]} ${sizes[size]} ${disabledClasses} ${className}`
  
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={classes}
      {...props}
    >
      {children}
    </button>
  )
}

export default Button
