import { createContext, useContext, useState, useEffect } from 'react'
import FirebaseService from '../utils/firebaseService'
import { initializeData } from '../utils/initData'
import { Timestamp } from 'firebase/firestore'

const DataContext = createContext(null)

export const useData = () => {
  const context = useContext(DataContext)
  if (!context) {
    throw new Error('useData doit être utilisé dans un DataProvider')
  }
  return context
}

// Fonction utilitaire pour convertir les timestamps Firestore en dates JavaScript
const convertTimestamps = (data) => {
  if (!data) return data
  if (Array.isArray(data)) {
    return data.map(item => convertTimestamps(item))
  }
  if (typeof data === 'object') {
    const converted = {}
    for (const key in data) {
      if (data[key] instanceof Timestamp) {
        converted[key] = data[key].toDate().toISOString()
      } else if (data[key] && typeof data[key] === 'object' && !Array.isArray(data[key])) {
        converted[key] = convertTimestamps(data[key])
      } else {
        converted[key] = data[key]
      }
    }
    return converted
  }
  return data
}

export const DataProvider = ({ children }) => {
  const [users, setUsers] = useState([])
  const [offres, setOffres] = useState([])
  const [candidatures, setCandidatures] = useState([])
  const [messages, setMessages] = useState([])
  const [notifications, setNotifications] = useState([])
  const [demandesEntreprises, setDemandesEntreprises] = useState([])
  const [contrats, setContrats] = useState([])
  const [loading, setLoading] = useState(true)

  // Configurer les listeners temps réel pour toutes les collections
  useEffect(() => {
    // Initialiser les données de démonstration si nécessaire (en arrière-plan)
    initializeData().catch(error => {
      console.error('Erreur lors de l\'initialisation des données:', error)
    })

    // Configurer les listeners temps réel
    const unsubscribeUsers = FirebaseService.subscribeUsers((data) => {
      setUsers(convertTimestamps(data))
      setLoading(false)
    })

    const unsubscribeOffres = FirebaseService.subscribeOffres((data) => {
      setOffres(convertTimestamps(data))
    })

    const unsubscribeCandidatures = FirebaseService.subscribeCandidatures((data) => {
      setCandidatures(convertTimestamps(data))
    })

    const unsubscribeMessages = FirebaseService.subscribeMessages((data) => {
      setMessages(convertTimestamps(data))
    })

    const unsubscribeNotifications = FirebaseService.subscribeNotifications((data) => {
      setNotifications(convertTimestamps(data))
    })

    const unsubscribeDemandes = FirebaseService.subscribeDemandesEntreprises((data) => {
      setDemandesEntreprises(convertTimestamps(data))
    })

    const unsubscribeContrats = FirebaseService.subscribeContrats((data) => {
      setContrats(convertTimestamps(data))
    })

    // Nettoyer les listeners au démontage
    return () => {
      unsubscribeUsers()
      unsubscribeOffres()
      unsubscribeCandidatures()
      unsubscribeMessages()
      unsubscribeNotifications()
      unsubscribeDemandes()
      unsubscribeContrats()
    }
  }, [])

  const loadAllData = async () => {
    setLoading(true)
    try {
      const [usersData, offresData, candidaturesData, messagesData, notificationsData, demandesData, contratsData] = await Promise.all([
        FirebaseService.getUsers(),
        FirebaseService.getOffres(),
        FirebaseService.getCandidatures(),
        FirebaseService.getMessages(),
        FirebaseService.getNotifications(),
        FirebaseService.getDemandesEntreprises(),
        FirebaseService.getContrats()
      ])
      
      setUsers(convertTimestamps(usersData))
      setOffres(convertTimestamps(offresData))
      setCandidatures(convertTimestamps(candidaturesData))
      setMessages(convertTimestamps(messagesData))
      setNotifications(convertTimestamps(notificationsData))
      setDemandesEntreprises(convertTimestamps(demandesData))
      setContrats(convertTimestamps(contratsData))
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error)
    } finally {
      setLoading(false)
    }
  }

  // ========== GESTION UTILISATEURS ==========
  const addUser = async (user) => {
    await FirebaseService.saveUser(user)
    // Les listeners temps réel mettront à jour automatiquement
  }

  const updateUser = async (id, updates) => {
    await FirebaseService.updateUser(id, updates)
    // Les listeners temps réel mettront à jour automatiquement
  }

  const deleteUser = async (id) => {
    await FirebaseService.deleteUser(id)
    // Les listeners temps réel mettront à jour automatiquement
  }

  // ========== GESTION OFFRES ==========
  const addOffre = async (offre) => {
    await FirebaseService.saveOffre(offre)
    // Les listeners temps réel mettront à jour automatiquement
  }

  const updateOffre = async (id, updates) => {
    await FirebaseService.updateOffre(id, updates)
    // Les listeners temps réel mettront à jour automatiquement
  }

  const deleteOffre = async (id) => {
    await FirebaseService.deleteOffre(id)
    // Les listeners temps réel mettront à jour automatiquement
  }

  // ========== GESTION CANDIDATURES ==========
  const addCandidature = async (candidature) => {
    await FirebaseService.saveCandidature(candidature)
    // Les listeners temps réel mettront à jour automatiquement
  }

  const updateCandidature = async (id, updates) => {
    await FirebaseService.updateCandidature(id, updates)
    // Les listeners temps réel mettront à jour automatiquement
  }

  const deleteCandidature = async (id) => {
    await FirebaseService.deleteCandidature(id)
    // Les listeners temps réel mettront à jour automatiquement
  }

  // ========== GESTION MESSAGES ==========
  const addMessage = async (message) => {
    await FirebaseService.saveMessage(message)
    // Les listeners temps réel mettront à jour automatiquement
  }

  const updateMessage = async (id, updates) => {
    await FirebaseService.updateMessage(id, updates)
    // Les listeners temps réel mettront à jour automatiquement
  }

  const deleteMessage = async (id) => {
    await FirebaseService.deleteMessage(id)
    // Les listeners temps réel mettront à jour automatiquement
  }

  // ========== GESTION NOTIFICATIONS ==========
  const addNotification = async (notification) => {
    await FirebaseService.saveNotification(notification)
    // Les listeners temps réel mettront à jour automatiquement
  }

  const markNotificationAsRead = async (id) => {
    await FirebaseService.markNotificationAsRead(id)
    // Les listeners temps réel mettront à jour automatiquement
  }

  const markAllNotificationsAsRead = async (userId) => {
    await FirebaseService.markAllNotificationsAsRead(userId)
    // Les listeners temps réel mettront à jour automatiquement
  }

  const deleteNotification = async (id) => {
    await FirebaseService.deleteNotification(id)
    // Les listeners temps réel mettront à jour automatiquement
  }

  // ========== GESTION DEMANDES ENTREPRISES ==========
  const addDemandeEntreprise = async (demande) => {
    await FirebaseService.saveDemandeEntreprise(demande)
    // Les listeners temps réel mettront à jour automatiquement
  }

  const updateDemandeEntreprise = async (id, updates) => {
    await FirebaseService.updateDemandeEntreprise(id, updates)
    // Les listeners temps réel mettront à jour automatiquement
  }

  const deleteDemandeEntreprise = async (id) => {
    await FirebaseService.deleteDemandeEntreprise(id)
    // Les listeners temps réel mettront à jour automatiquement
  }

  // ========== GESTION CONTRATS ==========
  const addContrat = async (contrat) => {
    await FirebaseService.saveContrat(contrat)
    // Les listeners temps réel mettront à jour automatiquement
  }

  const updateContrat = async (id, updates) => {
    await FirebaseService.updateContrat(id, updates)
    // Les listeners temps réel mettront à jour automatiquement
  }

  const value = {
    // Données
    users,
    offres,
    candidatures,
    messages,
    notifications,
    demandesEntreprises,
    contrats,
    loading,
    // Actions utilisateurs
    addUser,
    updateUser,
    deleteUser,
    // Actions offres
    addOffre,
    updateOffre,
    deleteOffre,
    // Actions candidatures
    addCandidature,
    updateCandidature,
    deleteCandidature,
    // Actions messages
    addMessage,
    updateMessage,
    deleteMessage,
    // Actions notifications
    addNotification,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    deleteNotification,
    // Actions demandes entreprises
    addDemandeEntreprise,
    updateDemandeEntreprise,
    deleteDemandeEntreprise,
    // Actions contrats
    addContrat,
    updateContrat,
    // Recharger toutes les données
    refreshData: loadAllData
  }

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>
}


