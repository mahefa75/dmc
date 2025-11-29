import { createContext, useContext, useState, useEffect } from 'react'
import StorageService from '../utils/storageService'
import { initializeData } from '../utils/initData'

const DataContext = createContext(null)

export const useData = () => {
  const context = useContext(DataContext)
  if (!context) {
    throw new Error('useData doit être utilisé dans un DataProvider')
  }
  return context
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

  // Charger toutes les données au démarrage
  useEffect(() => {
    // Initialiser les données de démonstration si nécessaire
    initializeData()
    loadAllData()
  }, [])

  const loadAllData = () => {
    setUsers(StorageService.getUsers())
    setOffres(StorageService.getOffres())
    setCandidatures(StorageService.getCandidatures())
    setMessages(StorageService.getMessages())
    setNotifications(StorageService.getNotifications())
    setDemandesEntreprises(StorageService.getDemandesEntreprises())
    setContrats(StorageService.getContrats())
    setLoading(false)
  }

  // ========== GESTION UTILISATEURS ==========
  const addUser = (user) => {
    StorageService.saveUser(user)
    setUsers(StorageService.getUsers())
  }

  const updateUser = (id, updates) => {
    StorageService.updateUser(id, updates)
    setUsers(StorageService.getUsers())
  }

  const deleteUser = (id) => {
    StorageService.deleteUser(id)
    setUsers(StorageService.getUsers())
  }

  // ========== GESTION OFFRES ==========
  const addOffre = (offre) => {
    StorageService.saveOffre(offre)
    setOffres(StorageService.getOffres())
  }

  const updateOffre = (id, updates) => {
    StorageService.updateOffre(id, updates)
    setOffres(StorageService.getOffres())
  }

  const deleteOffre = (id) => {
    StorageService.deleteOffre(id)
    setOffres(StorageService.getOffres())
  }

  // ========== GESTION CANDIDATURES ==========
  const addCandidature = (candidature) => {
    StorageService.saveCandidature(candidature)
    setCandidatures(StorageService.getCandidatures())
  }

  const updateCandidature = (id, updates) => {
    StorageService.updateCandidature(id, updates)
    setCandidatures(StorageService.getCandidatures())
  }

  const deleteCandidature = (id) => {
    StorageService.deleteCandidature(id)
    setCandidatures(StorageService.getCandidatures())
  }

  // ========== GESTION MESSAGES ==========
  const addMessage = (message) => {
    StorageService.saveMessage(message)
    setMessages(StorageService.getMessages())
  }

  const updateMessage = (id, updates) => {
    StorageService.updateMessage(id, updates)
    setMessages(StorageService.getMessages())
  }

  const deleteMessage = (id) => {
    StorageService.deleteMessage(id)
    setMessages(StorageService.getMessages())
  }

  // ========== GESTION NOTIFICATIONS ==========
  const addNotification = (notification) => {
    StorageService.saveNotification(notification)
    setNotifications(StorageService.getNotifications())
  }

  const markNotificationAsRead = (id) => {
    StorageService.markNotificationAsRead(id)
    setNotifications(StorageService.getNotifications())
  }

  const markAllNotificationsAsRead = (userId) => {
    StorageService.markAllNotificationsAsRead(userId)
    setNotifications(StorageService.getNotifications())
  }

  const deleteNotification = (id) => {
    StorageService.deleteNotification(id)
    setNotifications(StorageService.getNotifications())
  }

  // ========== GESTION DEMANDES ENTREPRISES ==========
  const addDemandeEntreprise = (demande) => {
    StorageService.saveDemandeEntreprise(demande)
    setDemandesEntreprises(StorageService.getDemandesEntreprises())
  }

  const updateDemandeEntreprise = (id, updates) => {
    StorageService.updateDemandeEntreprise(id, updates)
    setDemandesEntreprises(StorageService.getDemandesEntreprises())
  }

  const deleteDemandeEntreprise = (id) => {
    StorageService.deleteDemandeEntreprise(id)
    setDemandesEntreprises(StorageService.getDemandesEntreprises())
  }

  // ========== GESTION CONTRATS ==========
  const addContrat = (contrat) => {
    StorageService.saveContrat(contrat)
    setContrats(StorageService.getContrats())
  }

  const updateContrat = (id, updates) => {
    StorageService.updateContrat(id, updates)
    setContrats(StorageService.getContrats())
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


