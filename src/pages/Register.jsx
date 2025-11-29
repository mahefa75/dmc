import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Header, Footer } from '../components/Layout'
import { Input, Button, Card } from '../components/UI'
import { useAuth } from '../contexts/AuthContext'
import { useLanguage } from '../contexts/LanguageContext'
import { useToast } from '../components/UI/Toast'

const Register = () => {
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    password: '',
    confirmPassword: ''
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()
  const { t } = useLanguage()
  const navigate = useNavigate()
  const { showToast, ToastContainer } = useToast()

  const validate = () => {
    const newErrors = {}

    if (formData.nom.length < 2) {
      newErrors.nom = t('auth.lastNameMin')
    }
    if (formData.prenom.length < 2) {
      newErrors.prenom = t('auth.firstNameMin')
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = t('auth.emailInvalid')
    }
    if (!/^\+261/.test(formData.telephone)) {
      newErrors.telephone = t('auth.phoneFormat')
    }
    if (formData.password.length < 8) {
      newErrors.password = t('auth.passwordMin')
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = t('auth.passwordMatch')
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validate()) {
      showToast(t('auth.correctErrors'), 'error')
      return
    }

    setLoading(true)

    const result = await register({
      ...formData,
      role: 'candidat'
    })

    if (result.success) {
      showToast(t('auth.registerSuccess'), 'success')
      navigate('/candidat/dashboard')
    } else {
      showToast(result.error || t('auth.registerError'), 'error')
    }

    setLoading(false)
  }

  const validateField = (name, value) => {
    const newErrors = { ...errors }
    
    switch (name) {
      case 'nom':
        if (value.length > 0 && value.length < 2) {
          newErrors.nom = t('auth.lastNameMin')
        } else {
          delete newErrors.nom
        }
        break
      case 'prenom':
        if (value.length > 0 && value.length < 2) {
          newErrors.prenom = t('auth.firstNameMin')
        } else {
          delete newErrors.prenom
        }
        break
      case 'email':
        if (value.length > 0 && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          newErrors.email = t('auth.emailInvalid')
        } else {
          delete newErrors.email
        }
        break
      case 'telephone':
        if (value.length > 0 && !/^\+261/.test(value)) {
          newErrors.telephone = t('auth.phoneFormat')
        } else {
          delete newErrors.telephone
        }
        break
      case 'password':
        if (value.length > 0 && value.length < 8) {
          newErrors.password = t('auth.passwordMin')
        } else {
          delete newErrors.password
        }
        // Re-valider la confirmation si elle existe
        if (formData.confirmPassword && value !== formData.confirmPassword) {
          newErrors.confirmPassword = t('auth.passwordMatch')
        } else if (formData.confirmPassword) {
          delete newErrors.confirmPassword
        }
        break
      case 'confirmPassword':
        if (value.length > 0 && value !== formData.password) {
          newErrors.confirmPassword = t('auth.passwordMatch')
        } else {
          delete newErrors.confirmPassword
        }
        break
      default:
        break
    }
    
    setErrors(newErrors)
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })
    // Valider le champ en temps réel
    validateField(name, value)
  }

  const handleBlur = (e) => {
    const { name, value } = e.target
    validateField(name, value)
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center p-4 bg-gray-50">
        <div className="w-full max-w-md">
          <Card>
            <h1 className="text-3xl font-bold text-center mb-6">{t('auth.register')}</h1>

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label={t('auth.lastName')}
                name="nom"
                value={formData.nom}
                onChange={handleChange}
                onBlur={handleBlur}
                required
                error={errors.nom}
              />

              <Input
                label={t('auth.firstName')}
                name="prenom"
                value={formData.prenom}
                onChange={handleChange}
                onBlur={handleBlur}
                required
                error={errors.prenom}
              />

              <Input
                label={t('auth.email')}
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                onBlur={handleBlur}
                required
                error={errors.email}
              />

              <Input
                label={t('auth.phone')}
                name="telephone"
                value={formData.telephone}
                onChange={handleChange}
                onBlur={handleBlur}
                required
                placeholder="+261..."
                error={errors.telephone}
              />

              <Input
                label={t('auth.password')}
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                onBlur={handleBlur}
                required
                error={errors.password}
              />

              <Input
                label={t('auth.confirmPassword')}
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                onBlur={handleBlur}
                required
                error={errors.confirmPassword}
              />

              <Button
                type="submit"
                variant="primary"
                className="w-full"
                disabled={loading}
              >
                {loading ? t('common.loading') : t('auth.registerButton')}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                {t('auth.hasAccount')}{' '}
                <Link to="/login" className="text-blue-600 hover:underline">
                  {t('auth.login')}
                </Link>
              </p>
            </div>
          </Card>
        </div>
      </main>
      <Footer />
      <ToastContainer />
    </div>
  )
}

export default Register



