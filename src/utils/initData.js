// Initialisation des données de démonstration
import FirebaseService from './firebaseService'
import { generateMockData } from '../data/mockData'
import { migrateLocalStorageToFirebase, checkLocalStorageData } from './migrateToFirebase'

export const initializeData = async () => {
  try {
    // Vérifier si des données existent déjà dans Firebase
    const existingUsers = await FirebaseService.getUsers()
    
    // Si Firebase est vide, vérifier s'il y a des données dans localStorage à migrer
    if (existingUsers.length === 0) {
      const localData = checkLocalStorageData()
      
      if (localData.hasData) {
        console.log('📦 Des données ont été détectées dans localStorage, migration en cours...')
        const migrationReport = await migrateLocalStorageToFirebase()
        
        if (migrationReport.success) {
          console.log('✅ Migration réussie! Les données ont été transférées vers Firebase.')
          return { migrated: true, report: migrationReport }
        } else {
          console.warn('⚠️  Migration partielle. Certaines erreurs sont survenues.')
          return { migrated: true, report: migrationReport }
        }
      } else {
        // Aucune donnée dans localStorage, initialiser les données de démonstration
        console.log('📝 Aucune donnée à migrer, initialisation des données de démonstration...')
        const mockData = generateMockData()
        
        // Sauvegarder toutes les données de manière asynchrone
        await Promise.all([
          ...mockData.users.map(user => FirebaseService.saveUser(user)),
          ...mockData.offres.map(offre => FirebaseService.saveOffre(offre)),
          ...mockData.candidatures.map(candidature => FirebaseService.saveCandidature(candidature)),
          ...mockData.messages.map(message => FirebaseService.saveMessage(message)),
          ...mockData.notifications.map(notification => FirebaseService.saveNotification(notification)),
          ...mockData.demandesEntreprises.map(demande => FirebaseService.saveDemandeEntreprise(demande)),
          ...mockData.contrats.map(contrat => FirebaseService.saveContrat(contrat))
        ])
        
        console.log('✅ Données de démonstration initialisées dans Firebase')
        return { migrated: false, initialized: true }
      }
    }
    
    return { migrated: false, initialized: false }
  } catch (error) {
    console.error('❌ Erreur lors de l\'initialisation des données:', error)
    return { migrated: false, initialized: false, error: error.message }
  }
}






