import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { useLanguage } from '../../contexts/LanguageContext'
import { useData } from '../../contexts/DataContext'
import { Bell, User, LogOut, Menu, X, Diamond } from 'lucide-react'
import Button from '../UI/Button'

const Header = () => {
  const { user, logout, isAuthenticated } = useAuth()
  const { currentLang, changeLanguage, t } = useLanguage()
  const { notifications } = useData()
  const navigate = useNavigate()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)

  const unreadNotifications = notifications.filter(
    (n) => n.userId === user?.id && !n.lu
  ).length

  const handleLogout = () => {
    if (window.confirm(t('common.confirm') + ' - ' + t('nav.logout') + '?')) {
      logout()
      navigate('/')
    }
  }

  const getDashboardPath = () => {
    if (user?.role === 'candidat') return '/candidat/dashboard'
    if (user?.role === 'entreprise') return '/entreprise/dashboard'
    if (user?.role === 'admin') return '/admin/dashboard'
    return '/'
  }

  const languages = [
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'mg', name: 'Malagasy', flag: '🇲🇬' }
  ]

  return (
    <header className="sticky top-0 z-40 bg-navy-900 border-b border-navy-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <Diamond className="w-6 h-6 text-gold-500" />
            <span className="text-xl font-bold text-gray-100 font-display">
              {t('home.title').split(' ')[0]}
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              to="/"
              className="text-gray-400 hover:text-gold-500 transition-colors"
            >
              {t('nav.home')}
            </Link>
            <Link
              to="/candidat"
              className="text-gray-400 hover:text-gold-500 transition-colors"
            >
              {t('nav.candidat')}
            </Link>
            <Link
              to="/entreprise"
              className="text-gray-400 hover:text-gold-500 transition-colors"
            >
              {t('nav.entreprise')}
            </Link>
            <Link
              to="/contact"
              className="text-gray-400 hover:text-gold-500 transition-colors"
            >
              {t('nav.contact')}
            </Link>
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-4">
            {/* Language selector */}
            <div className="relative">
              <select
                value={currentLang}
                onChange={(e) => changeLanguage(e.target.value)}
                className="px-3 py-1.5 bg-navy-800 border border-navy-600 rounded-lg text-sm text-gray-300 focus:outline-none focus:ring-2 focus:ring-gold-500/50 focus:border-gold-500"
              >
                {languages.map((lang) => (
                  <option key={lang.code} value={lang.code} className="bg-navy-800">
                    {lang.flag} {lang.name}
                  </option>
                ))}
              </select>
            </div>

            {isAuthenticated ? (
              <>
                {/* Notifications */}
                <div className="relative">
                  <button
                    onClick={() => setNotificationsOpen(!notificationsOpen)}
                    className="relative p-2 text-gray-400 hover:text-gold-500 transition-colors"
                  >
                    <Bell className="w-5 h-5" />
                    {unreadNotifications > 0 && (
                      <span className="absolute top-0 right-0 w-4 h-4 bg-gold-500 text-navy-900 text-xs font-bold rounded-full flex items-center justify-center">
                        {unreadNotifications > 9 ? '9+' : unreadNotifications}
                      </span>
                    )}
                  </button>

                  {notificationsOpen && (
                    <div className="absolute right-0 mt-2 w-80 bg-navy-800 rounded-lg shadow-xl border border-navy-600 p-4 max-h-96 overflow-y-auto">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold text-gray-100">{t('notifications.title')}</h3>
                        <button
                          onClick={() => setNotificationsOpen(false)}
                          className="text-gray-500 hover:text-gray-300"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      {notifications
                        .filter((n) => n.userId === user?.id)
                        .slice(0, 5)
                        .map((notif) => (
                          <div
                            key={notif.id}
                            className="p-2 hover:bg-navy-700 rounded cursor-pointer transition-colors"
                          >
                            <p className="text-sm text-gray-300">{notif.message}</p>
                            <p className="text-xs text-gray-500 mt-1">
                              {new Date(notif.date).toLocaleDateString()}
                            </p>
                          </div>
                        ))}
                      <Link
                        to={
                          user?.role === 'candidat'
                            ? '/candidat/notifications'
                            : user?.role === 'entreprise'
                            ? '/entreprise/notifications'
                            : '/admin/notifications'
                        }
                        className="block text-center text-sm text-gold-500 mt-2 hover:text-gold-400"
                      >
                        {t('notifications.seeAll')}
                      </Link>
                    </div>
                  )}
                </div>

                {/* User menu */}
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 p-2 rounded-lg hover:bg-navy-800 text-gray-300"
                  >
                    <User className="w-5 h-5" />
                    <span className="hidden md:block text-sm">
                      {user?.prenom || user?.nom || user?.email}
                    </span>
                  </button>

                  {userMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-navy-800 rounded-lg shadow-xl border border-navy-600 py-2">
                      <Link
                        to={getDashboardPath()}
                        className="block px-4 py-2 text-sm text-gray-300 hover:bg-navy-700 hover:text-gold-500"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        {t('nav.dashboard')}
                      </Link>
                      <Link
                        to={
                          user?.role === 'candidat'
                            ? '/candidat/profil'
                            : '/entreprise/profil'
                        }
                        className="block px-4 py-2 text-sm text-gray-300 hover:bg-navy-700 hover:text-gold-500"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        {t('nav.profil')}
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-navy-700 flex items-center gap-2"
                      >
                        <LogOut className="w-4 h-4" />
                        {t('nav.logout')}
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <Link to="/login">
                <Button variant="outline" size="sm">
                  {t('nav.login')}
                </Button>
              </Link>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-gray-400 hover:text-gold-500"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-navy-700">
            <nav className="flex flex-col gap-2">
              <Link
                to="/"
                className="px-4 py-2 text-gray-300 hover:bg-navy-800 hover:text-gold-500 rounded transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t('nav.home')}
              </Link>
              <Link
                to="/candidat"
                className="px-4 py-2 text-gray-300 hover:bg-navy-800 hover:text-gold-500 rounded transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t('nav.candidat')}
              </Link>
              <Link
                to="/entreprise"
                className="px-4 py-2 text-gray-300 hover:bg-navy-800 hover:text-gold-500 rounded transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t('nav.entreprise')}
              </Link>
              <Link
                to="/contact"
                className="px-4 py-2 text-gray-300 hover:bg-navy-800 hover:text-gold-500 rounded transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t('nav.contact')}
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header
