import { Link } from 'react-router-dom'
import { useLanguage } from '../../contexts/LanguageContext'

const Footer = () => {
  const { t } = useLanguage()

  return (
    <footer className="bg-gray-800 text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* À propos */}
          <div>
            <h3 className="text-lg font-semibold mb-4">À propos</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>
                <Link to="/" className="hover:text-white">
                  {t('home.quiSommes')}
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white">
                  {t('nav.contact')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Services</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>
                <Link to="/candidat" className="hover:text-white">
                  {t('nav.candidat')}
                </Link>
              </li>
              <li>
                <Link to="/entreprise" className="hover:text-white">
                  {t('nav.entreprise')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Liens utiles */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Liens utiles</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>
                <Link to="/offres" className="hover:text-white">
                  {t('nav.offres')}
                </Link>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Mentions légales
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Politique de confidentialité
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>Email: contact@recrutement-mg-mu.com</li>
              <li>Téléphone: +261 34 00 000 00</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-700 text-center text-sm text-gray-400">
          <p>&copy; {new Date().getFullYear()} Plateforme de Recrutement Madagascar-Maurice. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer





