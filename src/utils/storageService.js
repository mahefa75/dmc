// Service de gestion du stockage localStorage
// Utilise window.storage comme spécifié dans le CDC

const STORAGE_KEYS = {
  USERS: 'users',
  OFFRES: 'offres',
  CANDIDATURES: 'candidatures',
  MESSAGES: 'messages',
  NOTIFICATIONS: 'notifications',
  DEMANDES_ENTREPRISES: 'demandes-entreprises',
  CONTRATS: 'contrats',
  CURRENT_USER: 'currentUser',
  CURRENT_LANG: 'currentLang'
}

// Initialiser window.storage si non défini
if (typeof window !== 'undefined' && !window.storage) {
  window.storage = localStorage
}

class StorageService {
  // ========== UTILITAIRES GÉNÉRIQUES ==========
  
  get(key, defaultValue = null) {
    try {
      const item = window.storage.getItem(key)
      return item ? JSON.parse(item) : defaultValue
    } catch (error) {
      console.error(`Erreur lors de la lecture de ${key}:`, error)
      return defaultValue
    }
  }

  set(key, value) {
    try {
      window.storage.setItem(key, JSON.stringify(value))
      return true
    } catch (error) {
      console.error(`Erreur lors de l'écriture de ${key}:`, error)
      return false
    }
  }

  remove(key) {
    try {
      window.storage.removeItem(key)
      return true
    } catch (error) {
      console.error(`Erreur lors de la suppression de ${key}:`, error)
      return false
    }
  }

  clear() {
    try {
      window.storage.clear()
      return true
    } catch (error) {
      console.error('Erreur lors du nettoyage du storage:', error)
      return false
    }
  }

  // ========== GESTION DES UTILISATEURS ==========
  
  getUsers() {
    return this.get(STORAGE_KEYS.USERS, [])
  }

  saveUser(user) {
    const users = this.getUsers()
    const existingIndex = users.findIndex(u => u.id === user.id)
    
    if (existingIndex >= 0) {
      users[existingIndex] = { ...users[existingIndex], ...user }
    } else {
      users.push(user)
    }
    
    return this.set(STORAGE_KEYS.USERS, users)
  }

  getUserById(id) {
    const users = this.getUsers()
    return users.find(u => u.id === id) || null
  }

  getUserByEmail(email) {
    const users = this.getUsers()
    return users.find(u => u.email === email) || null
  }

  updateUser(id, updates) {
    const users = this.getUsers()
    const index = users.findIndex(u => u.id === id)
    
    if (index >= 0) {
      users[index] = { ...users[index], ...updates }
      return this.set(STORAGE_KEYS.USERS, users)
    }
    
    return false
  }

  deleteUser(id) {
    const users = this.getUsers()
    const filtered = users.filter(u => u.id !== id)
    return this.set(STORAGE_KEYS.USERS, filtered)
  }

  // ========== GESTION DES OFFRES ==========
  
  getOffres() {
    return this.get(STORAGE_KEYS.OFFRES, [])
  }

  saveOffre(offre) {
    const offres = this.getOffres()
    const existingIndex = offres.findIndex(o => o.id === offre.id)
    
    if (existingIndex >= 0) {
      offres[existingIndex] = { ...offres[existingIndex], ...offre }
    } else {
      offres.push(offre)
    }
    
    return this.set(STORAGE_KEYS.OFFRES, offres)
  }

  getOffreById(id) {
    const offres = this.getOffres()
    return offres.find(o => o.id === id) || null
  }

  updateOffre(id, updates) {
    const offres = this.getOffres()
    const index = offres.findIndex(o => o.id === id)
    
    if (index >= 0) {
      offres[index] = { ...offres[index], ...updates }
      return this.set(STORAGE_KEYS.OFFRES, offres)
    }
    
    return false
  }

  deleteOffre(id) {
    const offres = this.getOffres()
    const filtered = offres.filter(o => o.id !== id)
    return this.set(STORAGE_KEYS.OFFRES, filtered)
  }

  // ========== GESTION DES CANDIDATURES ==========
  
  getCandidatures() {
    return this.get(STORAGE_KEYS.CANDIDATURES, [])
  }

  saveCandidature(candidature) {
    const candidatures = this.getCandidatures()
    const existingIndex = candidatures.findIndex(c => c.id === candidature.id)
    
    if (existingIndex >= 0) {
      candidatures[existingIndex] = { ...candidatures[existingIndex], ...candidature }
    } else {
      candidatures.push(candidature)
    }
    
    return this.set(STORAGE_KEYS.CANDIDATURES, candidatures)
  }

  getCandidatureById(id) {
    const candidatures = this.getCandidatures()
    return candidatures.find(c => c.id === id) || null
  }

  getCandidaturesByCandidat(candidatId) {
    const candidatures = this.getCandidatures()
    return candidatures.filter(c => c.candidatId === candidatId)
  }

  getCandidaturesByOffre(offreId) {
    const candidatures = this.getCandidatures()
    return candidatures.filter(c => c.offreId === offreId)
  }

  updateCandidature(id, updates) {
    const candidatures = this.getCandidatures()
    const index = candidatures.findIndex(c => c.id === id)
    
    if (index >= 0) {
      candidatures[index] = { ...candidatures[index], ...updates }
      return this.set(STORAGE_KEYS.CANDIDATURES, candidatures)
    }
    
    return false
  }

  deleteCandidature(id) {
    const candidatures = this.getCandidatures()
    const filtered = candidatures.filter(c => c.id !== id)
    return this.set(STORAGE_KEYS.CANDIDATURES, filtered)
  }

  // ========== GESTION DES MESSAGES ==========
  
  getMessages() {
    return this.get(STORAGE_KEYS.MESSAGES, [])
  }

  saveMessage(message) {
    const messages = this.getMessages()
    const existingIndex = messages.findIndex(m => m.id === message.id)
    
    if (existingIndex >= 0) {
      messages[existingIndex] = { ...messages[existingIndex], ...message }
    } else {
      messages.push(message)
    }
    
    return this.set(STORAGE_KEYS.MESSAGES, messages)
  }

  getMessageById(id) {
    const messages = this.getMessages()
    return messages.find(m => m.id === id) || null
  }

  getMessagesByUser(userId) {
    const messages = this.getMessages()
    return messages.filter(m => 
      m.expediteurId === userId || m.destinataireId === userId
    )
  }

  updateMessage(id, updates) {
    const messages = this.getMessages()
    const index = messages.findIndex(m => m.id === id)
    
    if (index >= 0) {
      messages[index] = { ...messages[index], ...updates }
      return this.set(STORAGE_KEYS.MESSAGES, messages)
    }
    
    return false
  }

  deleteMessage(id) {
    const messages = this.getMessages()
    const filtered = messages.filter(m => m.id !== id)
    return this.set(STORAGE_KEYS.MESSAGES, filtered)
  }

  // ========== GESTION DES NOTIFICATIONS ==========
  
  getNotifications() {
    return this.get(STORAGE_KEYS.NOTIFICATIONS, [])
  }

  saveNotification(notification) {
    const notifications = this.getNotifications()
    const existingIndex = notifications.findIndex(n => n.id === notification.id)
    
    if (existingIndex >= 0) {
      notifications[existingIndex] = { ...notifications[existingIndex], ...notification }
    } else {
      notifications.push(notification)
    }
    
    return this.set(STORAGE_KEYS.NOTIFICATIONS, notifications)
  }

  getNotificationsByUser(userId) {
    const notifications = this.getNotifications()
    return notifications.filter(n => n.userId === userId)
  }

  getUnreadNotificationsByUser(userId) {
    const notifications = this.getNotificationsByUser(userId)
    return notifications.filter(n => !n.lu)
  }

  markNotificationAsRead(id) {
    const notifications = this.getNotifications()
    const index = notifications.findIndex(n => n.id === id)
    
    if (index >= 0) {
      notifications[index].lu = true
      return this.set(STORAGE_KEYS.NOTIFICATIONS, notifications)
    }
    
    return false
  }

  markAllNotificationsAsRead(userId) {
    const notifications = this.getNotifications()
    const updated = notifications.map(n => 
      n.userId === userId && !n.lu ? { ...n, lu: true } : n
    )
    return this.set(STORAGE_KEYS.NOTIFICATIONS, updated)
  }

  deleteNotification(id) {
    const notifications = this.getNotifications()
    const filtered = notifications.filter(n => n.id !== id)
    return this.set(STORAGE_KEYS.NOTIFICATIONS, filtered)
  }

  // ========== GESTION DES DEMANDES ENTREPRISES ==========
  
  getDemandesEntreprises() {
    return this.get(STORAGE_KEYS.DEMANDES_ENTREPRISES, [])
  }

  saveDemandeEntreprise(demande) {
    const demandes = this.getDemandesEntreprises()
    const existingIndex = demandes.findIndex(d => d.id === demande.id)
    
    if (existingIndex >= 0) {
      demandes[existingIndex] = { ...demandes[existingIndex], ...demande }
    } else {
      demandes.push(demande)
    }
    
    return this.set(STORAGE_KEYS.DEMANDES_ENTREPRISES, demandes)
  }

  getDemandeEntrepriseById(id) {
    const demandes = this.getDemandesEntreprises()
    return demandes.find(d => d.id === id) || null
  }

  updateDemandeEntreprise(id, updates) {
    const demandes = this.getDemandesEntreprises()
    const index = demandes.findIndex(d => d.id === id)
    
    if (index >= 0) {
      demandes[index] = { ...demandes[index], ...updates }
      return this.set(STORAGE_KEYS.DEMANDES_ENTREPRISES, demandes)
    }
    
    return false
  }

  deleteDemandeEntreprise(id) {
    const demandes = this.getDemandesEntreprises()
    const filtered = demandes.filter(d => d.id !== id)
    return this.set(STORAGE_KEYS.DEMANDES_ENTREPRISES, filtered)
  }

  // ========== GESTION DES CONTRATS ==========
  
  getContrats() {
    return this.get(STORAGE_KEYS.CONTRATS, [])
  }

  saveContrat(contrat) {
    const contrats = this.getContrats()
    const existingIndex = contrats.findIndex(c => c.id === contrat.id)
    
    if (existingIndex >= 0) {
      contrats[existingIndex] = { ...contrats[existingIndex], ...contrat }
    } else {
      contrats.push(contrat)
    }
    
    return this.set(STORAGE_KEYS.CONTRATS, contrats)
  }

  getContratById(id) {
    const contrats = this.getContrats()
    return contrats.find(c => c.id === id) || null
  }

  getContratsByEntreprise(entrepriseId) {
    const contrats = this.getContrats()
    return contrats.filter(c => c.entrepriseId === entrepriseId)
  }

  updateContrat(id, updates) {
    const contrats = this.getContrats()
    const index = contrats.findIndex(c => c.id === id)
    
    if (index >= 0) {
      contrats[index] = { ...contrats[index], ...updates }
      return this.set(STORAGE_KEYS.CONTRATS, contrats)
    }
    
    return false
  }

  // ========== GESTION SESSION UTILISATEUR ==========
  
  getCurrentUser() {
    return this.get(STORAGE_KEYS.CURRENT_USER, null)
  }

  setCurrentUser(user) {
    return this.set(STORAGE_KEYS.CURRENT_USER, user)
  }

  clearCurrentUser() {
    return this.remove(STORAGE_KEYS.CURRENT_USER)
  }

  // ========== GESTION LANGUE ==========
  
  getCurrentLang() {
    return this.get(STORAGE_KEYS.CURRENT_LANG, 'fr')
  }

  setCurrentLang(lang) {
    return this.set(STORAGE_KEYS.CURRENT_LANG, lang)
  }
}

export default new StorageService()











