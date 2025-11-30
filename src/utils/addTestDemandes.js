// Script pour ajouter les demandes de test pour contact@techmu.mu
import FirebaseService from './firebaseService'
import { generateMockData } from '../data/mockData'

export const addTestDemandes = async () => {
  try {
    console.log('📝 Début de l\'ajout des demandes de test pour contact@techmu.mu...')
    
    // Générer les données mock
    console.log('📦 Génération des données mock...')
    const mockData = generateMockData()
    console.log('📊 Nombre total de demandes générées:', mockData.demandesEntreprises.length)
    
    // Filtrer les demandes pour TechMU
    const techmuDemandes = mockData.demandesEntreprises.filter(d => d.entrepriseId === 'demo-entreprise-001')
    console.log('🎯 Demandes TechMU trouvées:', techmuDemandes.length)
    console.log('📋 Détails des demandes:', techmuDemandes)
    
    if (techmuDemandes.length === 0) {
      console.error('❌ Aucune demande trouvée pour demo-entreprise-001')
      return { success: false, error: 'Aucune demande de test trouvée dans les données mock' }
    }
    
    // Vérifier les demandes existantes
    console.log('🔍 Vérification des demandes existantes...')
    const existingDemandes = await FirebaseService.getDemandesEntreprises()
    console.log('📊 Demandes existantes:', existingDemandes.length)
    
    const existingIds = new Set(existingDemandes.map(d => d.id || d.entrepriseId))
    console.log('🆔 IDs existants:', Array.from(existingIds))
    
    // Ajouter seulement les demandes qui n'existent pas déjà
    const demandesToAdd = techmuDemandes.filter(d => {
      const exists = existingIds.has(d.id)
      if (exists) {
        console.log(`⏭️  Demande ${d.id} existe déjà, ignorée`)
      }
      return !exists
    })
    
    console.log('➕ Demandes à ajouter:', demandesToAdd.length)
    
    if (demandesToAdd.length > 0) {
      console.log('💾 Sauvegarde des demandes dans Firebase...')
      const results = await Promise.all(
        demandesToAdd.map(async (demande, index) => {
          try {
            console.log(`💾 Sauvegarde demande ${index + 1}/${demandesToAdd.length}:`, demande.id, demande.posteRecherche)
            const result = await FirebaseService.saveDemandeEntreprise(demande)
            console.log(`✅ Demande ${index + 1} sauvegardée:`, result)
            return result
          } catch (error) {
            console.error(`❌ Erreur lors de la sauvegarde de la demande ${index + 1}:`, error)
            throw error
          }
        })
      )
      
      console.log(`✅ ${demandesToAdd.length} demandes de test ajoutées pour contact@techmu.mu`)
      console.log('📊 Résultats:', results)
      return { success: true, added: demandesToAdd.length, results }
    } else {
      console.log('ℹ️  Toutes les demandes de test existent déjà')
      return { success: true, added: 0, message: 'Toutes les demandes existent déjà' }
    }
  } catch (error) {
    console.error('❌ Erreur lors de l\'ajout des demandes de test:', error)
    console.error('Stack trace:', error.stack)
    return { success: false, error: error.message, stack: error.stack }
  }
}
