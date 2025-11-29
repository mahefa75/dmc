import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Header, Footer } from '../components/Layout'
import { Input, Button, Card } from '../components/UI'
import { useLanguage } from '../contexts/LanguageContext'
import { useToast } from '../components/UI/Toast'

const ForgotPassword = () => {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const { t } = useLanguage()
  const { showToast, ToastContainer } = useToast()

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validation email
    if (!email) {
      setError(t('auth.emailInvalid'))
      return
    }
    
    if (!validateEmail(email)) {
      setError(t('auth.emailInvalid'))
      return
    }

    setError('')
    setLoading(true)

    // Simulation d'envoi d'email
    console.log('Envoi email de réinitialisation à:', email)
    
    setTimeout(() => {
      setSent(true)
      setLoading(false)
      showToast(t('auth.resetEmailSent'), 'info')
    }, 1000)
  }

  const handleChange = (e) => {
    setEmail(e.target.value)
    // Effacer l'erreur quand l'utilisateur tape
    if (error) {
      setError('')
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center p-4 bg-gray-50">
        <div className="w-full max-w-md">
          <Card>
            <h1 className="text-3xl font-bold text-center mb-6">
              {t('auth.forgotPassword')}
            </h1>

            {sent ? (
              <div className="text-center">
                <div className="mb-4 text-green-600">
                  <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-gray-600 mb-4">
                  {t('auth.resetEmailSentMessage')} {email}
                </p>
                <Link to="/login">
                  <Button variant="primary" className="w-full">
                    Retour à la connexion
                  </Button>
                </Link>
              </div>
            ) : (
              <>
                <p className="text-gray-600 mb-6 text-center">
                  Entrez votre adresse email et nous vous enverrons un lien pour réinitialiser votre mot de passe.
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <Input
                    label={t('auth.email')}
                    type="email"
                    value={email}
                    onChange={handleChange}
                    required
                    placeholder="email@example.com"
                    error={error}
                  />

                  <Button
                    type="submit"
                    variant="primary"
                    className="w-full"
                    disabled={loading}
                  >
                    {loading ? t('common.loading') : t('auth.resetButton')}
                  </Button>
                </form>

                <div className="mt-6 text-center">
                  <Link to="/login" className="text-sm text-blue-600 hover:underline">
                    Retour à la connexion
                  </Link>
                </div>
              </>
            )}
          </Card>
        </div>
      </main>
      <Footer />
      <ToastContainer />
    </div>
  )
}

export default ForgotPassword



