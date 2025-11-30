import React from 'react'

const Select = ({
  label,
  name,
  value,
  onChange,
  options = [],
  placeholder,
  required = false,
  error,
  disabled = false,
  className = '',
  ...props
}) => {
  const selectId = name || `select-${Math.random().toString(36).substr(2, 9)}`
  
  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={selectId}
          className="block text-sm font-medium text-gray-300 mb-1"
        >
          {label}
          {required && <span className="text-gold-500 ml-1">*</span>}
        </label>
      )}
      <select
        id={selectId}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
        className={`
          w-full px-4 py-2 bg-navy-800 border rounded-lg text-gray-100
          focus:outline-none focus:ring-2 focus:ring-gold-500/50 focus:border-gold-500
          disabled:bg-navy-900 disabled:cursor-not-allowed disabled:text-gray-500
          ${error ? 'border-red-500' : 'border-navy-600'}
          ${className}
        `}
        {...props}
      >
        {placeholder && (
          <option value="" className="bg-navy-800 text-gray-400">{placeholder}</option>
        )}
        {options.map((option) => (
          <option
            key={typeof option === 'object' ? option.value : option}
            value={typeof option === 'object' ? option.value : option}
            className="bg-navy-800 text-gray-100"
          >
            {typeof option === 'object' ? option.label : option}
          </option>
        ))}
      </select>
      {error && (
        <p className="mt-1 text-sm text-red-400">{error}</p>
      )}
    </div>
  )
}

export default Select
