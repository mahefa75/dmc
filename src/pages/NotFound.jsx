import { Link } from 'react-router-dom'
import { Header, Footer } from '../components/Layout'
import Button from '../components/UI/Button'
import { useLanguage } from '../contexts/LanguageContext'

const NotFound = () => {
  const { t } = useLanguage()

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-9xl font-bold text-gray-300">404</h1>
          <h2 className="text-3xl font-semibold text-gray-800 mt-4">
            Page non trouvée
          </h2>
          <p className="text-gray-600 mt-2 mb-8">
            La page que vous recherchez n'existe pas ou a été déplacée.
          </p>
          <Link to="/">
            <Button variant="primary">Retour à l'accueil</Button>
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default NotFound






