// Service de gestion du stockage Firebase Firestore
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  onSnapshot,
  addDoc,
  serverTimestamp
} from 'firebase/firestore'
import { db } from '../config/firebase'

// Collections Firestore
const COLLECTIONS = {
  USERS: 'users',
  OFFRES: 'offres',
  CANDIDATURES: 'candidatures',
  MESSAGES: 'messages',
  NOTIFICATIONS: 'notifications',
  DEMANDES_ENTREPRISES: 'demandesEntreprises',
  CONTRATS: 'contrats'
}

class FirebaseService {
  // ========== UTILITAIRES GÉNÉRIQUES ==========
  
  // Convertir un document Firestore en objet JavaScript
  docToObject(docSnapshot) {
    if (!docSnapshot.exists()) return null
    return { id: docSnapshot.id, ...docSnapshot.data() }
  }

  // Convertir plusieurs documents Firestore en tableau
  docsToArray(querySnapshot) {
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
  }

  // ========== GESTION DES UTILISATEURS ==========
  
  async getUsers() {
    try {
      const querySnapshot = await getDocs(collection(db, COLLECTIONS.USERS))
      return this.docsToArray(querySnapshot)
    } catch (error) {
      console.error('Erreur lors de la récupération des utilisateurs:', error)
      return []
    }
  }

  async saveUser(user) {
    try {
      if (user.id) {
        // Mise à jour d'un utilisateur existant
        const userRef = doc(db, COLLECTIONS.USERS, user.id)
        const { id, ...userData } = user
        await setDoc(userRef, { ...userData, updatedAt: serverTimestamp() }, { merge: true })
        return true
      } else {
        // Création d'un nouvel utilisateur
        const userRef = doc(collection(db, COLLECTIONS.USERS))
        const newUser = { ...user, id: userRef.id, createdAt: serverTimestamp() }
        await setDoc(userRef, newUser)
        return newUser.id
      }
    } catch (error) {
      console.error('Erreur lors de la sauvegarde de l\'utilisateur:', error)
      return false
    }
  }

  async getUserById(id) {
    try {
      const userRef = doc(db, COLLECTIONS.USERS, id)
      const userSnap = await getDoc(userRef)
      return this.docToObject(userSnap)
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'utilisateur:', error)
      return null
    }
  }

  async getUserByEmail(email) {
    try {
      const q = query(collection(db, COLLECTIONS.USERS), where('email', '==', email))
      const querySnapshot = await getDocs(q)
      if (querySnapshot.empty) return null
      return this.docToObject(querySnapshot.docs[0])
    } catch (error) {
      console.error('Erreur lors de la recherche par email:', error)
      return null
    }
  }

  async updateUser(id, updates) {
    try {
      const userRef = doc(db, COLLECTIONS.USERS, id)
      await updateDoc(userRef, { ...updates, updatedAt: serverTimestamp() })
      return true
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'utilisateur:', error)
      return false
    }
  }

  async deleteUser(id) {
    try {
      await deleteDoc(doc(db, COLLECTIONS.USERS, id))
      return true
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'utilisateur:', error)
      return false
    }
  }

  // Listener temps réel pour les utilisateurs
  subscribeUsers(callback) {
    return onSnapshot(collection(db, COLLECTIONS.USERS), (snapshot) => {
      callback(this.docsToArray(snapshot))
    }, (error) => {
      console.error('Erreur lors de l\'écoute des utilisateurs:', error)
    })
  }

  // ========== GESTION DES OFFRES ==========
  
  async getOffres() {
    try {
      const querySnapshot = await getDocs(collection(db, COLLECTIONS.OFFRES))
      return this.docsToArray(querySnapshot)
    } catch (error) {
      console.error('Erreur lors de la récupération des offres:', error)
      return []
    }
  }

  async saveOffre(offre) {
    try {
      if (offre.id) {
        const offreRef = doc(db, COLLECTIONS.OFFRES, offre.id)
        const { id, ...offreData } = offre
        await setDoc(offreRef, { ...offreData, updatedAt: serverTimestamp() }, { merge: true })
        return true
      } else {
        const offreRef = doc(collection(db, COLLECTIONS.OFFRES))
        const newOffre = { ...offre, id: offreRef.id, createdAt: serverTimestamp() }
        await setDoc(offreRef, newOffre)
        return newOffre.id
      }
    } catch (error) {
      console.error('Erreur lors de la sauvegarde de l\'offre:', error)
      return false
    }
  }

  async getOffreById(id) {
    try {
      const offreRef = doc(db, COLLECTIONS.OFFRES, id)
      const offreSnap = await getDoc(offreRef)
      return this.docToObject(offreSnap)
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'offre:', error)
      return null
    }
  }

  async updateOffre(id, updates) {
    try {
      const offreRef = doc(db, COLLECTIONS.OFFRES, id)
      await updateDoc(offreRef, { ...updates, updatedAt: serverTimestamp() })
      return true
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'offre:', error)
      return false
    }
  }

  async deleteOffre(id) {
    try {
      await deleteDoc(doc(db, COLLECTIONS.OFFRES, id))
      return true
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'offre:', error)
      return false
    }
  }

  subscribeOffres(callback) {
    return onSnapshot(collection(db, COLLECTIONS.OFFRES), (snapshot) => {
      callback(this.docsToArray(snapshot))
    }, (error) => {
      console.error('Erreur lors de l\'écoute des offres:', error)
    })
  }

  // ========== GESTION DES CANDIDATURES ==========
  
  async getCandidatures() {
    try {
      const querySnapshot = await getDocs(collection(db, COLLECTIONS.CANDIDATURES))
      return this.docsToArray(querySnapshot)
    } catch (error) {
      console.error('Erreur lors de la récupération des candidatures:', error)
      return []
    }
  }

  async saveCandidature(candidature) {
    try {
      if (candidature.id) {
        const candidatureRef = doc(db, COLLECTIONS.CANDIDATURES, candidature.id)
        const { id, ...candidatureData } = candidature
        await setDoc(candidatureRef, { ...candidatureData, updatedAt: serverTimestamp() }, { merge: true })
        return true
      } else {
        const candidatureRef = doc(collection(db, COLLECTIONS.CANDIDATURES))
        const newCandidature = { ...candidature, id: candidatureRef.id, createdAt: serverTimestamp() }
        await setDoc(candidatureRef, newCandidature)
        return newCandidature.id
      }
    } catch (error) {
      console.error('Erreur lors de la sauvegarde de la candidature:', error)
      return false
    }
  }

  async getCandidatureById(id) {
    try {
      const candidatureRef = doc(db, COLLECTIONS.CANDIDATURES, id)
      const candidatureSnap = await getDoc(candidatureRef)
      return this.docToObject(candidatureSnap)
    } catch (error) {
      console.error('Erreur lors de la récupération de la candidature:', error)
      return null
    }
  }

  async getCandidaturesByCandidat(candidatId) {
    try {
      const q = query(collection(db, COLLECTIONS.CANDIDATURES), where('candidatId', '==', candidatId))
      const querySnapshot = await getDocs(q)
      return this.docsToArray(querySnapshot)
    } catch (error) {
      console.error('Erreur lors de la récupération des candidatures:', error)
      return []
    }
  }

  async getCandidaturesByOffre(offreId) {
    try {
      const q = query(collection(db, COLLECTIONS.CANDIDATURES), where('offreId', '==', offreId))
      const querySnapshot = await getDocs(q)
      return this.docsToArray(querySnapshot)
    } catch (error) {
      console.error('Erreur lors de la récupération des candidatures:', error)
      return []
    }
  }

  async updateCandidature(id, updates) {
    try {
      const candidatureRef = doc(db, COLLECTIONS.CANDIDATURES, id)
      await updateDoc(candidatureRef, { ...updates, updatedAt: serverTimestamp() })
      return true
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la candidature:', error)
      return false
    }
  }

  async deleteCandidature(id) {
    try {
      await deleteDoc(doc(db, COLLECTIONS.CANDIDATURES, id))
      return true
    } catch (error) {
      console.error('Erreur lors de la suppression de la candidature:', error)
      return false
    }
  }

  subscribeCandidatures(callback) {
    return onSnapshot(collection(db, COLLECTIONS.CANDIDATURES), (snapshot) => {
      callback(this.docsToArray(snapshot))
    }, (error) => {
      console.error('Erreur lors de l\'écoute des candidatures:', error)
    })
  }

  // ========== GESTION DES MESSAGES ==========
  
  async getMessages() {
    try {
      const querySnapshot = await getDocs(collection(db, COLLECTIONS.MESSAGES))
      return this.docsToArray(querySnapshot)
    } catch (error) {
      console.error('Erreur lors de la récupération des messages:', error)
      return []
    }
  }

  async saveMessage(message) {
    try {
      if (message.id) {
        const messageRef = doc(db, COLLECTIONS.MESSAGES, message.id)
        const { id, ...messageData } = message
        await setDoc(messageRef, { ...messageData, updatedAt: serverTimestamp() }, { merge: true })
        return true
      } else {
        const messageRef = doc(collection(db, COLLECTIONS.MESSAGES))
        const newMessage = { ...message, id: messageRef.id, createdAt: serverTimestamp() }
        await setDoc(messageRef, newMessage)
        return newMessage.id
      }
    } catch (error) {
      console.error('Erreur lors de la sauvegarde du message:', error)
      return false
    }
  }

  async getMessageById(id) {
    try {
      const messageRef = doc(db, COLLECTIONS.MESSAGES, id)
      const messageSnap = await getDoc(messageRef)
      return this.docToObject(messageSnap)
    } catch (error) {
      console.error('Erreur lors de la récupération du message:', error)
      return null
    }
  }

  async getMessagesByUser(userId) {
    try {
      const q = query(
        collection(db, COLLECTIONS.MESSAGES),
        where('expediteurId', '==', userId)
      )
      const querySnapshot = await getDocs(q)
      const messages1 = this.docsToArray(querySnapshot)
      
      const q2 = query(
        collection(db, COLLECTIONS.MESSAGES),
        where('destinataireId', '==', userId)
      )
      const querySnapshot2 = await getDocs(q2)
      const messages2 = this.docsToArray(querySnapshot2)
      
      return [...messages1, ...messages2]
    } catch (error) {
      console.error('Erreur lors de la récupération des messages:', error)
      return []
    }
  }

  async updateMessage(id, updates) {
    try {
      const messageRef = doc(db, COLLECTIONS.MESSAGES, id)
      await updateDoc(messageRef, { ...updates, updatedAt: serverTimestamp() })
      return true
    } catch (error) {
      console.error('Erreur lors de la mise à jour du message:', error)
      return false
    }
  }

  async deleteMessage(id) {
    try {
      await deleteDoc(doc(db, COLLECTIONS.MESSAGES, id))
      return true
    } catch (error) {
      console.error('Erreur lors de la suppression du message:', error)
      return false
    }
  }

  subscribeMessages(callback) {
    return onSnapshot(collection(db, COLLECTIONS.MESSAGES), (snapshot) => {
      callback(this.docsToArray(snapshot))
    }, (error) => {
      console.error('Erreur lors de l\'écoute des messages:', error)
    })
  }

  // ========== GESTION DES NOTIFICATIONS ==========
  
  async getNotifications() {
    try {
      const querySnapshot = await getDocs(collection(db, COLLECTIONS.NOTIFICATIONS))
      return this.docsToArray(querySnapshot)
    } catch (error) {
      console.error('Erreur lors de la récupération des notifications:', error)
      return []
    }
  }

  async saveNotification(notification) {
    try {
      if (notification.id) {
        const notificationRef = doc(db, COLLECTIONS.NOTIFICATIONS, notification.id)
        const { id, ...notificationData } = notification
        await setDoc(notificationRef, { ...notificationData, updatedAt: serverTimestamp() }, { merge: true })
        return true
      } else {
        const notificationRef = doc(collection(db, COLLECTIONS.NOTIFICATIONS))
        const newNotification = { ...notification, id: notificationRef.id, createdAt: serverTimestamp() }
        await setDoc(notificationRef, newNotification)
        return newNotification.id
      }
    } catch (error) {
      console.error('Erreur lors de la sauvegarde de la notification:', error)
      return false
    }
  }

  async getNotificationsByUser(userId) {
    try {
      const q = query(collection(db, COLLECTIONS.NOTIFICATIONS), where('userId', '==', userId))
      const querySnapshot = await getDocs(q)
      return this.docsToArray(querySnapshot)
    } catch (error) {
      console.error('Erreur lors de la récupération des notifications:', error)
      return []
    }
  }

  async getUnreadNotificationsByUser(userId) {
    try {
      const q = query(
        collection(db, COLLECTIONS.NOTIFICATIONS),
        where('userId', '==', userId),
        where('lu', '==', false)
      )
      const querySnapshot = await getDocs(q)
      return this.docsToArray(querySnapshot)
    } catch (error) {
      console.error('Erreur lors de la récupération des notifications non lues:', error)
      return []
    }
  }

  async markNotificationAsRead(id) {
    try {
      const notificationRef = doc(db, COLLECTIONS.NOTIFICATIONS, id)
      await updateDoc(notificationRef, { lu: true, updatedAt: serverTimestamp() })
      return true
    } catch (error) {
      console.error('Erreur lors du marquage de la notification:', error)
      return false
    }
  }

  async markAllNotificationsAsRead(userId) {
    try {
      const notifications = await this.getNotificationsByUser(userId)
      const unreadNotifications = notifications.filter(n => !n.lu)
      
      const updatePromises = unreadNotifications.map(notification =>
        updateDoc(doc(db, COLLECTIONS.NOTIFICATIONS, notification.id), {
          lu: true,
          updatedAt: serverTimestamp()
        })
      )
      
      await Promise.all(updatePromises)
      return true
    } catch (error) {
      console.error('Erreur lors du marquage de toutes les notifications:', error)
      return false
    }
  }

  async deleteNotification(id) {
    try {
      await deleteDoc(doc(db, COLLECTIONS.NOTIFICATIONS, id))
      return true
    } catch (error) {
      console.error('Erreur lors de la suppression de la notification:', error)
      return false
    }
  }

  subscribeNotifications(callback) {
    return onSnapshot(collection(db, COLLECTIONS.NOTIFICATIONS), (snapshot) => {
      callback(this.docsToArray(snapshot))
    }, (error) => {
      console.error('Erreur lors de l\'écoute des notifications:', error)
    })
  }

  // ========== GESTION DES DEMANDES ENTREPRISES ==========
  
  async getDemandesEntreprises() {
    try {
      const querySnapshot = await getDocs(collection(db, COLLECTIONS.DEMANDES_ENTREPRISES))
      return this.docsToArray(querySnapshot)
    } catch (error) {
      console.error('Erreur lors de la récupération des demandes:', error)
      return []
    }
  }

  async saveDemandeEntreprise(demande) {
    try {
      if (demande.id) {
        const demandeRef = doc(db, COLLECTIONS.DEMANDES_ENTREPRISES, demande.id)
        const { id, ...demandeData } = demande
        await setDoc(demandeRef, { ...demandeData, updatedAt: serverTimestamp() }, { merge: true })
        return true
      } else {
        const demandeRef = doc(collection(db, COLLECTIONS.DEMANDES_ENTREPRISES))
        const newDemande = { ...demande, id: demandeRef.id, createdAt: serverTimestamp() }
        await setDoc(demandeRef, newDemande)
        return newDemande.id
      }
    } catch (error) {
      console.error('Erreur lors de la sauvegarde de la demande:', error)
      return false
    }
  }

  async getDemandeEntrepriseById(id) {
    try {
      const demandeRef = doc(db, COLLECTIONS.DEMANDES_ENTREPRISES, id)
      const demandeSnap = await getDoc(demandeRef)
      return this.docToObject(demandeSnap)
    } catch (error) {
      console.error('Erreur lors de la récupération de la demande:', error)
      return null
    }
  }

  async updateDemandeEntreprise(id, updates) {
    try {
      const demandeRef = doc(db, COLLECTIONS.DEMANDES_ENTREPRISES, id)
      await updateDoc(demandeRef, { ...updates, updatedAt: serverTimestamp() })
      return true
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la demande:', error)
      return false
    }
  }

  async deleteDemandeEntreprise(id) {
    try {
      await deleteDoc(doc(db, COLLECTIONS.DEMANDES_ENTREPRISES, id))
      return true
    } catch (error) {
      console.error('Erreur lors de la suppression de la demande:', error)
      return false
    }
  }

  subscribeDemandesEntreprises(callback) {
    return onSnapshot(collection(db, COLLECTIONS.DEMANDES_ENTREPRISES), (snapshot) => {
      callback(this.docsToArray(snapshot))
    }, (error) => {
      console.error('Erreur lors de l\'écoute des demandes:', error)
    })
  }

  // ========== GESTION DES CONTRATS ==========
  
  async getContrats() {
    try {
      const querySnapshot = await getDocs(collection(db, COLLECTIONS.CONTRATS))
      return this.docsToArray(querySnapshot)
    } catch (error) {
      console.error('Erreur lors de la récupération des contrats:', error)
      return []
    }
  }

  async saveContrat(contrat) {
    try {
      if (contrat.id) {
        const contratRef = doc(db, COLLECTIONS.CONTRATS, contrat.id)
        const { id, ...contratData } = contrat
        await setDoc(contratRef, { ...contratData, updatedAt: serverTimestamp() }, { merge: true })
        return true
      } else {
        const contratRef = doc(collection(db, COLLECTIONS.CONTRATS))
        const newContrat = { ...contrat, id: contratRef.id, createdAt: serverTimestamp() }
        await setDoc(contratRef, newContrat)
        return newContrat.id
      }
    } catch (error) {
      console.error('Erreur lors de la sauvegarde du contrat:', error)
      return false
    }
  }

  async getContratById(id) {
    try {
      const contratRef = doc(db, COLLECTIONS.CONTRATS, id)
      const contratSnap = await getDoc(contratRef)
      return this.docToObject(contratSnap)
    } catch (error) {
      console.error('Erreur lors de la récupération du contrat:', error)
      return null
    }
  }

  async getContratsByEntreprise(entrepriseId) {
    try {
      const q = query(collection(db, COLLECTIONS.CONTRATS), where('entrepriseId', '==', entrepriseId))
      const querySnapshot = await getDocs(q)
      return this.docsToArray(querySnapshot)
    } catch (error) {
      console.error('Erreur lors de la récupération des contrats:', error)
      return []
    }
  }

  async updateContrat(id, updates) {
    try {
      const contratRef = doc(db, COLLECTIONS.CONTRATS, id)
      await updateDoc(contratRef, { ...updates, updatedAt: serverTimestamp() })
      return true
    } catch (error) {
      console.error('Erreur lors de la mise à jour du contrat:', error)
      return false
    }
  }

  subscribeContrats(callback) {
    return onSnapshot(collection(db, COLLECTIONS.CONTRATS), (snapshot) => {
      callback(this.docsToArray(snapshot))
    }, (error) => {
      console.error('Erreur lors de l\'écoute des contrats:', error)
    })
  }
}

export default new FirebaseService()

