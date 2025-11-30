import { Link } from 'react-router-dom'
import { useLanguage } from '../../contexts/LanguageContext'
import { Diamond } from 'lucide-react'

const Footer = () => {
  const { t } = useLanguage()

  return (
    <footer className="bg-navy-900 border-t border-navy-700 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo & Description */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Diamond className="w-6 h-6 text-gold-500" />
              <span className="text-xl font-bold text-gray-100 font-display">
                Recrutement MG-MU
              </span>
            </div>
            <p className="text-sm text-gray-400">
              {t('footer.description')}
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-100">{t('footer.navigation')}</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link to="/about" className="hover:text-gold-500 transition-colors">
                  {t('about.title')}
                </Link>
              </li>
              <li>
                <Link to="/offres" className="hover:text-gold-500 transition-colors">
                  {t('nav.offres')}
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-gold-500 transition-colors">
                  {t('nav.contact')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-100">{t('footer.services')}</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link to="/candidat" className="hover:text-gold-500 transition-colors">
                  {t('nav.candidat')}
                </Link>
              </li>
              <li>
                <Link to="/entreprise" className="hover:text-gold-500 transition-colors">
                  {t('nav.entreprise')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-100">{t('footer.support')}</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link to="/faq" className="hover:text-gold-500 transition-colors">
                  {t('footer.faq')}
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-gold-500 transition-colors">
                  {t('nav.contact')}
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-gold-500 transition-colors">
                  {t('footer.privacyPolicy')}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-navy-700 text-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} {t('footer.copyright')}</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
