import { useState, useMemo } from 'react'
import { Header, Sidebar } from '../../components/Layout'
import { Card, Badge, Input, Select, Button } from '../../components/UI'
import { useAuth } from '../../contexts/AuthContext'
import { useData } from '../../contexts/DataContext'
import { useLanguage } from '../../contexts/LanguageContext'
import { useToast } from '../../components/UI/Toast'
import { Search, Trash2, CheckCircle } from 'lucide-react'

const CandidatNotifications = () => {
  const { user } = useAuth()
  const { notifications, markNotificationAsRead, markAllNotificationsAsRead, deleteNotification } = useData()
  const { t } = useLanguage()
  const { showToast, ToastContainer } = useToast()
  const [searchTerm, setSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [selectedNotifications, setSelectedNotifications] = useState([])

  const mesNotifications = useMemo(() => {
    let filtered = notifications
      .filter(n => n.userId === user?.id)
      .sort((a, b) => new Date(b.date) - new Date(a.date))

    if (searchTerm) {
      filtered = filtered.filter(n => 
        n.message.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (typeFilter) {
      filtered = filtered.filter(n => n.type === typeFilter)
    }

    return filtered
  }, [notifications, user, searchTerm, typeFilter])

  const groupedNotifications = useMemo(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    const groups = {
      today: [],
      yesterday: [],
      older: []
    }

    mesNotifications.forEach(notif => {
      const notifDate = new Date(notif.date)
      notifDate.setHours(0, 0, 0, 0)

      if (notifDate.getTime() === today.getTime()) {
        groups.today.push(notif)
      } else if (notifDate.getTime() === yesterday.getTime()) {
        groups.yesterday.push(notif)
      } else {
        groups.older.push(notif)
      }
    })

    return groups
  }, [mesNotifications])

  const handleMarkAsRead = (id) => {
    markNotificationAsRead(id)
  }

  const handleSelectAll = () => {
    if (selectedNotifications.length === mesNotifications.length) {
      setSelectedNotifications([])
    } else {
      setSelectedNotifications(mesNotifications.map(n => n.id))
    }
  }

  const handleDeleteSelected = () => {
    selectedNotifications.forEach(id => {
      deleteNotification(id)
    })
    setSelectedNotifications([])
    showToast(`${selectedNotifications.length} notification(s) supprimée(s)`, 'success')
  }

  const handleMarkAllAsRead = () => {
    markAllNotificationsAsRead(user.id)
    showToast('Toutes les notifications ont été marquées comme lues', 'success')
  }

  return (
    <div className="min-h-screen flex flex-col bg-navy-900">
      <Header />
      <div className="flex flex-1">
        <Sidebar role="candidat" />
        <main className="flex-1 p-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-display font-bold text-gray-100">{t('notifications.title')}</h1>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleMarkAllAsRead}>
                <CheckCircle className="w-4 h-4 mr-1" />
                Tout marquer comme lu
              </Button>
              {selectedNotifications.length > 0 && (
                <Button variant="danger" size="sm" onClick={handleDeleteSelected}>
                  <Trash2 className="w-4 h-4 mr-1" />
                  Supprimer ({selectedNotifications.length})
                </Button>
              )}
            </div>
          </div>

          <div className="mb-6 space-y-4">
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  placeholder="Rechercher..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="w-48"
              >
                <option value="">Tous les types</option>
                <option value="nouvelle_offre">Nouvelle offre</option>
                <option value="changement_statut">Changement statut</option>
                <option value="nouveau_message">Nouveau message</option>
                <option value="rappel_document">Rappel document</option>
                <option value="entretien_planifie">Entretien planifié</option>
              </Select>
            </div>
          </div>

          {mesNotifications.length === 0 ? (
            <Card>
              <p className="text-center text-gray-400 py-8">{t('notifications.noNotifications')}</p>
            </Card>
          ) : (
            <div className="space-y-8">
              {/* Aujourd'hui */}
              {groupedNotifications.today.length > 0 && (
                <div>
                  <h2 className="text-xl font-semibold mb-4 text-gray-100">{t('notifications.today')}</h2>
                  <div className="space-y-4">
                    {groupedNotifications.today.map(notif => (
                      <Card
                        key={notif.id}
                        className={`cursor-pointer ${!notif.lu ? 'bg-gold-500/10 border-gold-500/30' : ''}`}
                        onClick={() => handleMarkAsRead(notif.id)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3 flex-1">
                            <input
                              type="checkbox"
                              checked={selectedNotifications.includes(notif.id)}
                              onChange={(e) => {
                                e.stopPropagation()
                                if (e.target.checked) {
                                  setSelectedNotifications([...selectedNotifications, notif.id])
                                } else {
                                  setSelectedNotifications(selectedNotifications.filter(id => id !== notif.id))
                                }
                              }}
                              onClick={(e) => e.stopPropagation()}
                              className="mt-1"
                            />
                            <div className="flex-1">
                              <p className="font-medium text-gray-100">{notif.message}</p>
                              <p className="text-sm text-gray-400 mt-1">
                                {new Date(notif.date).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                              </p>
                            </div>
                          </div>
                          {!notif.lu && (
                            <Badge variant="primary">Nouveau</Badge>
                          )}
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* Hier */}
              {groupedNotifications.yesterday.length > 0 && (
                <div>
                  <h2 className="text-xl font-semibold mb-4 text-gray-100">{t('notifications.yesterday')}</h2>
                  <div className="space-y-4">
                    {groupedNotifications.yesterday.map(notif => (
                      <Card
                        key={notif.id}
                        className={`cursor-pointer ${!notif.lu ? 'bg-gold-500/10 border-gold-500/30' : ''}`}
                        onClick={() => handleMarkAsRead(notif.id)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3 flex-1">
                            <input
                              type="checkbox"
                              checked={selectedNotifications.includes(notif.id)}
                              onChange={(e) => {
                                e.stopPropagation()
                                if (e.target.checked) {
                                  setSelectedNotifications([...selectedNotifications, notif.id])
                                } else {
                                  setSelectedNotifications(selectedNotifications.filter(id => id !== notif.id))
                                }
                              }}
                              onClick={(e) => e.stopPropagation()}
                              className="mt-1"
                            />
                            <div className="flex-1">
                              <p className="font-medium text-gray-100">{notif.message}</p>
                              <p className="text-sm text-gray-400 mt-1">
                                {new Date(notif.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'numeric', year: 'numeric' })}
                              </p>
                            </div>
                          </div>
                          {!notif.lu && (
                            <Badge variant="primary">Nouveau</Badge>
                          )}
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* Plus ancien */}
              {groupedNotifications.older.length > 0 && (
                <div>
                  <h2 className="text-xl font-semibold mb-4 text-gray-100">{t('notifications.older')}</h2>
                  <div className="space-y-4">
                    {groupedNotifications.older.map(notif => (
                      <Card
                        key={notif.id}
                        className={`cursor-pointer ${!notif.lu ? 'bg-gold-500/10 border-gold-500/30' : ''}`}
                        onClick={() => handleMarkAsRead(notif.id)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3 flex-1">
                            <input
                              type="checkbox"
                              checked={selectedNotifications.includes(notif.id)}
                              onChange={(e) => {
                                e.stopPropagation()
                                if (e.target.checked) {
                                  setSelectedNotifications([...selectedNotifications, notif.id])
                                } else {
                                  setSelectedNotifications(selectedNotifications.filter(id => id !== notif.id))
                                }
                              }}
                              onClick={(e) => e.stopPropagation()}
                              className="mt-1"
                            />
                            <div className="flex-1">
                              <p className="font-medium text-gray-100">{notif.message}</p>
                              <p className="text-sm text-gray-400 mt-1">
                                {new Date(notif.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'numeric', year: 'numeric' })}
                              </p>
                            </div>
                          </div>
                          {!notif.lu && (
                            <Badge variant="primary">Nouveau</Badge>
                          )}
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
      <ToastContainer />
    </div>
  )
}

export default CandidatNotifications



