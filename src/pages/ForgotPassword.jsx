import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Header, Footer } from '../components/Layout'
import { Input, Button, Card } from '../components/UI'
import { useLanguage } from '../contexts/LanguageContext'
import { useToast } from '../components/UI/Toast'
import { Diamond, CheckCircle } from 'lucide-react'

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
    <div className="min-h-screen flex flex-col bg-navy-900">
      <Header />
      <main className="flex-1 flex items-center justify-center p-4">
        {/* Background decorations */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gold-500/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gold-500/5 rounded-full blur-3xl"></div>
        </div>
        
        <div className="w-full max-w-md relative z-10">
          <Card variant="glass" className="p-8">
            <div className="flex justify-center mb-6">
              <Diamond className="w-12 h-12 text-gold-500" />
            </div>
            <h1 className="text-3xl font-display font-bold text-center mb-2 text-gray-100">
              {t('auth.forgotPassword')}
            </h1>

            {sent ? (
              <div className="text-center mt-8">
                <div className="mb-6">
                  <CheckCircle className="w-16 h-16 mx-auto text-gold-500" />
                </div>
                <p className="text-gray-300 mb-6">
                  {t('auth.resetEmailSentMessage')} <span className="text-gold-500">{email}</span>
                </p>
                <Link to="/login">
                  <Button variant="gold" className="w-full">
                    Retour à la connexion
                  </Button>
                </Link>
              </div>
            ) : (
              <>
                <p className="text-gray-400 mb-8 text-center">
                  Entrez votre adresse email et nous vous enverrons un lien pour réinitialiser votre mot de passe.
                </p>

                <form onSubmit={handleSubmit} className="space-y-5">
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
                    variant="gold"
                    className="w-full"
                    disabled={loading}
                  >
                    {loading ? t('common.loading') : t('auth.resetButton')}
                  </Button>
                </form>

                <div className="mt-8 text-center">
                  <Link to="/login" className="text-sm text-gold-500 hover:text-gold-400 transition-colors">
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
