import React, { useEffect } from 'react'
import { X } from 'lucide-react'
import Button from './Button'

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = 'md',
  className = ''
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  if (!isOpen) return null

  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-full mx-4'
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      <div
        className={`bg-navy-800 border border-navy-600 rounded-lg shadow-2xl ${sizes[size]} w-full max-h-[90vh] overflow-y-auto animate-slideUp ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        {(title || onClose) && (
          <div className="flex items-center justify-between p-6 border-b border-navy-600">
            {title && (
              <h2 className="text-2xl font-bold text-gray-100 font-display">{title}</h2>
            )}
            {onClose && (
              <button
                onClick={onClose}
                className="p-2 hover:bg-navy-700 rounded-full transition-colors"
                aria-label="Fermer"
              >
                <X className="w-5 h-5 text-gray-400 hover:text-gold-500" />
              </button>
            )}
          </div>
        )}

        {/* Content */}
        <div className="p-6 text-gray-200">{children}</div>

        {/* Footer */}
        {footer && (
          <div className="flex items-center justify-end gap-3 p-6 border-t border-navy-600">
            {footer}
          </div>
        )}
      </div>
    </div>
  )
}

export default Modal
