import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Header, Footer } from '../components/Layout'
import { Input, Button, Card } from '../components/UI'
import { useAuth } from '../contexts/AuthContext'
import { useLanguage } from '../contexts/LanguageContext'
import { useToast } from '../components/UI/Toast'
import { Diamond } from 'lucide-react'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const { t } = useLanguage()
  const navigate = useNavigate()
  const { showToast, ToastContainer } = useToast()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const result = await login(email, password)
    
    if (result.success) {
      showToast(t('common.success') + ' - Connexion réussie', 'success')
      const dashboardPath = 
        result.user.role === 'candidat' ? '/candidat/dashboard' :
        result.user.role === 'entreprise' ? '/entreprise/dashboard' :
        '/admin/dashboard'
      navigate(dashboardPath)
    } else {
      setError(result.error || 'Erreur de connexion')
      showToast(result.error || 'Erreur de connexion', 'error')
    }
    
    setLoading(false)
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
              {t('auth.login')}
            </h1>
            <p className="text-gray-400 text-center mb-8">
              Accédez à votre espace personnel
            </p>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <Input
                label={t('auth.email')}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="email@example.com"
              />

              <Input
                label={t('auth.password')}
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <div className="flex items-center justify-end">
                <Link
                  to="/forgot-password"
                  className="text-sm text-gold-500 hover:text-gold-400 transition-colors"
                >
                  {t('auth.forgotPassword')}
                </Link>
              </div>

              {error && (
                <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                variant="gold"
                className="w-full"
                disabled={loading}
              >
                {loading ? t('common.loading') : t('auth.loginButton')}
              </Button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-sm text-gray-400">
                {t('auth.noAccount')}{' '}
                <Link to="/register" className="text-gold-500 hover:text-gold-400 transition-colors">
                  {t('auth.register')}
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

export default Login
