import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Header, Footer } from '../components/Layout'
import { Input, Button, Card } from '../components/UI'
import { useAuth } from '../contexts/AuthContext'
import { useLanguage } from '../contexts/LanguageContext'
import { useToast } from '../components/UI/Toast'

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
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center p-4 bg-gray-50">
        <div className="w-full max-w-md">
          <Card>
            <h1 className="text-3xl font-bold text-center mb-6">{t('auth.login')}</h1>
            
            <form onSubmit={handleSubmit} className="space-y-4">
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

              <div className="flex items-center justify-between">
                <Link
                  to="/forgot-password"
                  className="text-sm text-blue-600 hover:underline"
                >
                  {t('auth.forgotPassword')}
                </Link>
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                variant="primary"
                className="w-full"
                disabled={loading}
              >
                {loading ? t('common.loading') : t('auth.loginButton')}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                {t('auth.noAccount')}{' '}
                <Link to="/register" className="text-blue-600 hover:underline">
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

