// Initialisation des données de démonstration
import StorageService from './storageService'
import { generateMockData } from '../data/mockData'

export const initializeData = () => {
  // Vérifier si des données existent déjà
  const existingUsers = StorageService.getUsers()
  
  if (existingUsers.length === 0) {
    // Charger les données de démonstration
    const mockData = generateMockData()
    
    // Sauvegarder toutes les données
    mockData.users.forEach(user => StorageService.saveUser(user))
    mockData.offres.forEach(offre => StorageService.saveOffre(offre))
    mockData.candidatures.forEach(candidature => StorageService.saveCandidature(candidature))
    mockData.messages.forEach(message => StorageService.saveMessage(message))
    mockData.notifications.forEach(notification => StorageService.saveNotification(notification))
    mockData.demandesEntreprises.forEach(demande => StorageService.saveDemandeEntreprise(demande))
    mockData.contrats.forEach(contrat => StorageService.saveContrat(contrat))
    
    console.log('Données de démonstration initialisées')
    return true
  }
  
  return false
}




