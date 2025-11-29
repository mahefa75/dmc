import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useLanguage } from '../../contexts/LanguageContext'
import {
  LayoutDashboard,
  User,
  Briefcase,
  FileText,
  Bell,
  MessageSquare,
  Settings,
  Users,
  Building,
  FileCheck,
  BarChart3,
  CreditCard,
  Shield,
  X,
  Menu
} from 'lucide-react'

const Sidebar = ({ role }) => {
  const location = useLocation()
  const { t } = useLanguage()
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  // Fermer la sidebar sur mobile lors du changement de route
  useEffect(() => {
    setIsMobileOpen(false)
  }, [location.pathname])

  const candidatMenu = [
    { path: '/candidat/dashboard', icon: LayoutDashboard, label: t('nav.dashboard') },
    { path: '/candidat/profil', icon: User, label: t('nav.profil') },
    { path: '/candidat/offres', icon: Briefcase, label: t('nav.offres') },
    { path: '/candidat/candidatures', icon: FileText, label: t('nav.candidatures') },
    { path: '/candidat/notifications', icon: Bell, label: t('nav.notifications') },
    { path: '/candidat/messagerie', icon: MessageSquare, label: t('nav.messagerie') }
  ]

  const entrepriseMenu = [
    { path: '/entreprise/dashboard', icon: LayoutDashboard, label: t('entreprise.dashboard') },
    { path: '/entreprise/recherche-cv', icon: Users, label: t('entreprise.rechercheCV') },
    { path: '/entreprise/nouvelle-demande', icon: FileText, label: t('entreprise.nouvelleDemande') },
    { path: '/entreprise/demandes', icon: FileCheck, label: t('entreprise.mesDemandes') },
    { path: '/entreprise/abonnement', icon: CreditCard, label: t('entreprise.abonnement') },
    { path: '/entreprise/messagerie', icon: MessageSquare, label: t('nav.messagerie') }
  ]

  const adminMenu = [
    { path: '/admin/dashboard', icon: LayoutDashboard, label: t('admin.dashboard') },
    { path: '/admin/offres', icon: Briefcase, label: t('admin.offres') },
    { path: '/admin/candidats', icon: Users, label: t('admin.candidats') },
    { path: '/admin/candidatures', icon: FileText, label: t('admin.candidatures') },
    { path: '/admin/demandes-entreprises', icon: Building, label: t('admin.demandesEntreprises') },
    { path: '/admin/entreprises', icon: Building, label: t('admin.entreprises') },
    { path: '/admin/messagerie', icon: MessageSquare, label: t('admin.messagerie') },
    { path: '/admin/contrats', icon: FileCheck, label: t('admin.contrats') },
    { path: '/admin/facturation', icon: CreditCard, label: t('admin.facturation') },
    { path: '/admin/statistiques', icon: BarChart3, label: t('admin.statistiques') },
    { path: '/admin/utilisateurs', icon: Shield, label: t('admin.utilisateurs') }
  ]

  const menu = role === 'candidat' ? candidatMenu : role === 'entreprise' ? entrepriseMenu : adminMenu

  return (
    <>
      {/* Bouton menu burger sur mobile */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="lg:hidden fixed top-20 left-4 z-50 p-2 bg-white rounded-lg shadow-lg border border-gray-200 hover:bg-gray-50"
        aria-label="Toggle menu"
      >
        {isMobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Overlay sur mobile */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        w-64 bg-gray-50 min-h-screen border-r border-gray-200
        fixed lg:static top-0 left-0 z-40
        transform transition-transform duration-300 ease-in-out
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <nav className="p-4 pt-20 lg:pt-4">
          <ul className="space-y-2">
            {menu.map((item) => {
              const Icon = item.icon
              const isActive = location.pathname === item.path

              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`
                      flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
                      ${
                        isActive
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-700 hover:bg-gray-200'
                      }
                    `}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>
      </aside>
    </>
  )
}

export default Sidebar






