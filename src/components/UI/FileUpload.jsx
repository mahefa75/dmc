import React, { useRef, useState } from 'react'
import { Upload, X } from 'lucide-react'

const FileUpload = ({
  label,
  accept,
  maxSize = 5 * 1024 * 1024, // 5MB par défaut
  onFileSelect,
  value,
  error,
  required = false,
  className = '',
  ...props
}) => {
  const fileInputRef = useRef(null)
  const [dragActive, setDragActive] = useState(false)
  const [preview, setPreview] = useState(null)

  const handleFile = (file) => {
    if (!file) return

    // Vérifier la taille
    if (file.size > maxSize) {
      alert(`Le fichier est trop volumineux. Taille maximale: ${maxSize / 1024 / 1024}MB`)
      return
    }

    // Prévisualisation pour les images
    if (file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setPreview(e.target.result)
      }
      reader.readAsDataURL(file)
    } else {
      setPreview(null)
    }

    onFileSelect?.(file)
  }

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }

  const handleChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0])
    }
  }

  const removeFile = () => {
    setPreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
    onFileSelect?.(null)
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
  }

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-300 mb-1">
          {label}
          {required && <span className="text-gold-500 ml-1">*</span>}
        </label>
      )}

      <div
        className={`
          border-2 border-dashed rounded-lg p-6
          transition-colors bg-navy-800
          ${dragActive ? 'border-gold-500 bg-gold-500/5' : 'border-navy-600'}
          ${error ? 'border-red-500' : ''}
        `}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        {preview ? (
          <div className="relative">
            <img
              src={preview}
              alt="Preview"
              className="max-h-48 mx-auto rounded-lg"
            />
            <button
              onClick={removeFile}
              className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : value ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Upload className="w-5 h-5 text-gold-500" />
              <span className="text-sm text-gray-300">
                {value.name} ({formatFileSize(value.size)})
              </span>
            </div>
            <button
              onClick={removeFile}
              className="p-1 text-red-400 hover:text-red-300 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="text-center">
            <Upload className="w-12 h-12 text-gray-500 mx-auto mb-2" />
            <p className="text-sm text-gray-400 mb-1">
              Glissez-déposez un fichier ici ou{' '}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-gold-500 hover:text-gold-400 underline transition-colors"
              >
                parcourez
              </button>
            </p>
            <p className="text-xs text-gray-500">
              Taille maximale: {formatFileSize(maxSize)}
            </p>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleChange}
          className="hidden"
          {...props}
        />
      </div>

      {error && (
        <p className="mt-1 text-sm text-red-400">{error}</p>
      )}
    </div>
  )
}

export default FileUpload
