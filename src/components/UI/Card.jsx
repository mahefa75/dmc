import React from 'react'

const Card = ({
  children,
  className = '',
  hover = false,
  onClick,
  ...props
}) => {
  const baseClasses = 'bg-white rounded-lg shadow-md p-6'
  const hoverClasses = hover ? 'hover:shadow-lg hover:scale-105 transition-all duration-200 cursor-pointer' : ''
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






