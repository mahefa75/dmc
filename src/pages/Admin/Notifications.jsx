import { useState, useMemo, useEffect } from 'react'
import { Header, Sidebar } from '../../components/Layout'
import { Card, Button, Badge, Input, Select, Pagination } from '../../components/UI'
import { useData } from '../../contexts/DataContext'
import { useLanguage } from '../../contexts/LanguageContext'
import { useToast } from '../../components/UI/Toast'
import { 
  Bell, Search, Trash2, CheckCircle, Mail, Briefcase, 
  User, AlertCircle, Filter, Check
} from 'lucide-react'

const AdminNotifications = () => {
  const { notifications, markNotificationAsRead, markAllNotificationsAsRead, deleteNotification } = useData()
  const { t } = useLanguage()
  const { showToast, ToastContainer } = useToast()

  const [searchTerm, setSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [selectedNotifications, setSelectedNotifications] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 20 // Nombre de notifications par page

  // Helper pour obtenir la date d'une notification
  const getNotificationDate = (n) => {
    const dateStr = n.createdAt || n.date
    if (!dateStr) return null
    const date = new Date(dateStr)
    return isNaN(date.getTime()) ? null : date
  }

  // Filtrer les notifications
  const filteredNotifications = useMemo(() => {
    let filtered = [...notifications]

    if (searchTerm) {
      filtered = filtered.filter(n => 
        n.titre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        n.message?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        n.type?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (typeFilter !== 'all') {
      filtered = filtered.filter(n => n.type === typeFilter)
    }

    return filtered.sort((a, b) => {
      const dateA = getNotificationDate(a)
      const dateB = getNotificationDate(b)
      if (!dateA) return 1
      if (!dateB) return -1
      return dateB - dateA
    })
  }, [notifications, searchTerm, typeFilter])

  // Réinitialiser la page quand les filtres changent
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, typeFilter])

  // Grouper par date
  const groupedNotifications = useMemo(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    return {
      today: filteredNotifications.filter(n => {
        const date = getNotificationDate(n)
        return date && date >= today
      }),
      yesterday: filteredNotifications.filter(n => {
        const date = getNotificationDate(n)
        return date && date >= yesterday && date < today
      }),
      older: filteredNotifications.filter(n => {
        const date = getNotificationDate(n)
        return !date || date < yesterday
      })
    }
  }, [filteredNotifications])

  const handleSelectAll = () => {
    if (selectedNotifications.length === filteredNotifications.length) {
      setSelectedNotifications([])
    } else {
      setSelectedNotifications(filteredNotifications.map(n => n.id))
    }
  }

  const handleDeleteSelected = () => {
    selectedNotifications.forEach(id => {
      deleteNotification(id)
    })
    setSelectedNotifications([])
    showToast(`${selectedNotifications.length} notification(s) supprimée(s)`, 'success')
  }

  const handleMarkAllRead = () => {
    markAllNotificationsAsRead()
    showToast('Toutes les notifications ont été marquées comme lues', 'success')
  }

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'candidature':
        return <Briefcase className="w-5 h-5 text-blue-400" />
      case 'message':
        return <Mail className="w-5 h-5 text-green-400" />
      case 'user':
        return <User className="w-5 h-5 text-purple-400" />
      case 'alert':
        return <AlertCircle className="w-5 h-5 text-red-400" />
      default:
        return <Bell className="w-5 h-5 text-gold-500" />
    }
  }

  // Formater le type pour l'affichage
  const formatType = (type) => {
    const types = {
      'candidature': 'Candidature',
      'changement_statut': 'Changement de statut',
      'entretien_planifie': 'Entretien planifié',
      'rappel_document': 'Rappel document',
      'message': 'Message',
      'user': 'Utilisateur',
      'alert': 'Alerte'
    }
    return types[type] || type || 'Notification'
  }

  const renderNotificationItem = (notif) => {
    const notifDate = getNotificationDate(notif)
    return (
      <div
        key={notif.id}
        className={`p-4 rounded-lg flex items-start gap-4 transition-colors ${
          notif.lu ? 'bg-navy-800' : 'bg-navy-800/50 border-l-4 border-gold-500'
        }`}
      >
        <input
          type="checkbox"
          checked={selectedNotifications.includes(notif.id)}
          onChange={(e) => {
            if (e.target.checked) {
              setSelectedNotifications([...selectedNotifications, notif.id])
            } else {
              setSelectedNotifications(selectedNotifications.filter(id => id !== notif.id))
            }
          }}
          className="mt-1 w-4 h-4 rounded border-navy-600 bg-navy-700 text-gold-500 focus:ring-gold-500"
        />
        <div className="flex-shrink-0 mt-1">
          {getNotificationIcon(notif.type)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className={`font-medium ${notif.lu ? 'text-gray-300' : 'text-gray-100'}`}>
                {notif.titre || formatType(notif.type)}
              </p>
              <p className="text-sm text-gray-400 mt-1">{notif.message}</p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <span className="text-xs text-gray-500">
                {notifDate ? notifDate.toLocaleString('fr-FR', {
                  day: '2-digit',
                  month: '2-digit',
                  hour: '2-digit',
                  minute: '2-digit'
                }) : '-'}
              </span>
            {!notif.lu && (
              <button
                onClick={() => markNotificationAsRead(notif.id)}
                className="p-1 text-gray-400 hover:text-green-400 transition-colors"
                title="Marquer comme lu"
              >
                <Check className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={() => {
                deleteNotification(notif.id)
                showToast('Notification supprimée', 'success')
              }}
              className="p-1 text-gray-400 hover:text-red-400 transition-colors"
              title="Supprimer"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )}

  const unreadCount = notifications.filter(n => !n.lu).length

  return (
    <div className="h-screen flex flex-col bg-navy-900 overflow-hidden">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar role="admin" />
        <main className="flex-1 p-8 overflow-y-auto">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <h1 className="text-3xl font-display font-bold text-gray-100">
                {t('notifications.title')}
              </h1>
              {unreadCount > 0 && (
                <Badge variant="warning">{unreadCount} non lue(s)</Badge>
              )}
            </div>
            <div className="flex gap-3">
              {selectedNotifications.length > 0 && (
                <Button variant="danger" onClick={handleDeleteSelected}>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Supprimer ({selectedNotifications.length})
                </Button>
              )}
              <Button variant="secondary" onClick={handleMarkAllRead}>
                <CheckCircle className="w-4 h-4 mr-2" />
                Tout marquer comme lu
              </Button>
            </div>
          </div>

          {/* Filtres */}
          <Card className="mb-6">
            <div className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-[200px]">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Rechercher..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-navy-800 border border-navy-600 rounded-lg text-gray-100 focus:outline-none focus:border-gold-500"
                  />
                </div>
              </div>
              <Select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                options={[
                  { value: 'all', label: 'Tous les types' },
                  { value: 'candidature', label: 'Candidatures' },
                  { value: 'message', label: 'Messages' },
                  { value: 'user', label: 'Utilisateurs' },
                  { value: 'alert', label: 'Alertes' }
                ]}
                className="w-48"
              />
              <Button variant="outline" onClick={handleSelectAll}>
                {selectedNotifications.length === filteredNotifications.length ? 'Tout désélectionner' : 'Tout sélectionner'}
              </Button>
            </div>
          </Card>

          {/* Liste des notifications */}
          {filteredNotifications.length === 0 ? (
            <Card>
              <div className="text-center py-12">
                <Bell className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">{t('notifications.noNotifications')}</p>
              </div>
            </Card>
          ) : (
            <div className="space-y-4">
              {/* Liste paginée */}
              <Card>
                <div className="space-y-3">
                  {filteredNotifications
                    .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                    .map(renderNotificationItem)}
                </div>
              </Card>

              {/* Pagination */}
              <Card className="p-4">
                <Pagination
                  currentPage={currentPage}
                  totalPages={Math.ceil(filteredNotifications.length / itemsPerPage)}
                  totalItems={filteredNotifications.length}
                  itemsPerPage={itemsPerPage}
                  onPageChange={(page) => {
                    setCurrentPage(page)
                    // Scroll vers le haut de la liste
                    const mainElement = document.querySelector('main')
                    if (mainElement) {
                      mainElement.scrollTo({ top: 0, behavior: 'smooth' })
                    }
                  }}
                />
              </Card>
            </div>
          )}
        </main>
      </div>
      <ToastContainer />
    </div>
  )
}

export default AdminNotifications

