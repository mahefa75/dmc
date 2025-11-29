// Script de migration des données localStorage vers Firebase
import StorageService from './storageService'
import FirebaseService from './firebaseService'

/**
 * Migre toutes les données du localStorage vers Firebase
 * @returns {Promise<Object>} Rapport de migration avec les statistiques
 */
export const migrateLocalStorageToFirebase = async () => {
  const report = {
    success: true,
    errors: [],
    stats: {
      users: { migrated: 0, skipped: 0, errors: 0 },
      offres: { migrated: 0, skipped: 0, errors: 0 },
      candidatures: { migrated: 0, skipped: 0, errors: 0 },
      messages: { migrated: 0, skipped: 0, errors: 0 },
      notifications: { migrated: 0, skipped: 0, errors: 0 },
      demandesEntreprises: { migrated: 0, skipped: 0, errors: 0 },
      contrats: { migrated: 0, skipped: 0, errors: 0 }
    }
  }

  try {
    console.log('🚀 Début de la migration des données vers Firebase...')

    // ========== MIGRATION DES UTILISATEURS ==========
    console.log('📦 Migration des utilisateurs...')
    const localUsers = StorageService.getUsers()
    const firebaseUsers = await FirebaseService.getUsers()
    const firebaseUserIds = new Set(firebaseUsers.map(u => u.id))
    const firebaseUserEmails = new Set(firebaseUsers.map(u => u.email?.toLowerCase()))

    for (const user of localUsers) {
      try {
        // Vérifier si l'utilisateur existe déjà (par ID ou email)
        const existsById = firebaseUserIds.has(user.id)
        const existsByEmail = user.email && firebaseUserEmails.has(user.email.toLowerCase())

        if (existsById || existsByEmail) {
          report.stats.users.skipped++
          console.log(`⏭️  Utilisateur ${user.email} déjà présent, ignoré`)
          continue
        }

        // Migrer l'utilisateur
        await FirebaseService.saveUser(user)
        report.stats.users.migrated++
        console.log(`✅ Utilisateur ${user.email} migré`)
      } catch (error) {
        report.stats.users.errors++
        report.errors.push(`Erreur lors de la migration de l'utilisateur ${user.email}: ${error.message}`)
        console.error(`❌ Erreur pour l'utilisateur ${user.email}:`, error)
      }
    }

    // ========== MIGRATION DES OFFRES ==========
    console.log('📦 Migration des offres...')
    const localOffres = StorageService.getOffres()
    const firebaseOffres = await FirebaseService.getOffres()
    const firebaseOffreIds = new Set(firebaseOffres.map(o => o.id))

    for (const offre of localOffres) {
      try {
        if (firebaseOffreIds.has(offre.id)) {
          report.stats.offres.skipped++
          continue
        }

        await FirebaseService.saveOffre(offre)
        report.stats.offres.migrated++
        console.log(`✅ Offre ${offre.titre} migrée`)
      } catch (error) {
        report.stats.offres.errors++
        report.errors.push(`Erreur lors de la migration de l'offre ${offre.id}: ${error.message}`)
        console.error(`❌ Erreur pour l'offre ${offre.id}:`, error)
      }
    }

    // ========== MIGRATION DES CANDIDATURES ==========
    console.log('📦 Migration des candidatures...')
    const localCandidatures = StorageService.getCandidatures()
    const firebaseCandidatures = await FirebaseService.getCandidatures()
    const firebaseCandidatureIds = new Set(firebaseCandidatures.map(c => c.id))

    for (const candidature of localCandidatures) {
      try {
        if (firebaseCandidatureIds.has(candidature.id)) {
          report.stats.candidatures.skipped++
          continue
        }

        await FirebaseService.saveCandidature(candidature)
        report.stats.candidatures.migrated++
        console.log(`✅ Candidature ${candidature.id} migrée`)
      } catch (error) {
        report.stats.candidatures.errors++
        report.errors.push(`Erreur lors de la migration de la candidature ${candidature.id}: ${error.message}`)
        console.error(`❌ Erreur pour la candidature ${candidature.id}:`, error)
      }
    }

    // ========== MIGRATION DES MESSAGES ==========
    console.log('📦 Migration des messages...')
    const localMessages = StorageService.getMessages()
    const firebaseMessages = await FirebaseService.getMessages()
    const firebaseMessageIds = new Set(firebaseMessages.map(m => m.id))

    for (const message of localMessages) {
      try {
        if (firebaseMessageIds.has(message.id)) {
          report.stats.messages.skipped++
          continue
        }

        await FirebaseService.saveMessage(message)
        report.stats.messages.migrated++
        console.log(`✅ Message ${message.id} migré`)
      } catch (error) {
        report.stats.messages.errors++
        report.errors.push(`Erreur lors de la migration du message ${message.id}: ${error.message}`)
        console.error(`❌ Erreur pour le message ${message.id}:`, error)
      }
    }

    // ========== MIGRATION DES NOTIFICATIONS ==========
    console.log('📦 Migration des notifications...')
    const localNotifications = StorageService.getNotifications()
    const firebaseNotifications = await FirebaseService.getNotifications()
    const firebaseNotificationIds = new Set(firebaseNotifications.map(n => n.id))

    for (const notification of localNotifications) {
      try {
        if (firebaseNotificationIds.has(notification.id)) {
          report.stats.notifications.skipped++
          continue
        }

        await FirebaseService.saveNotification(notification)
        report.stats.notifications.migrated++
        console.log(`✅ Notification ${notification.id} migrée`)
      } catch (error) {
        report.stats.notifications.errors++
        report.errors.push(`Erreur lors de la migration de la notification ${notification.id}: ${error.message}`)
        console.error(`❌ Erreur pour la notification ${notification.id}:`, error)
      }
    }

    // ========== MIGRATION DES DEMANDES ENTREPRISES ==========
    console.log('📦 Migration des demandes entreprises...')
    const localDemandes = StorageService.getDemandesEntreprises()
    const firebaseDemandes = await FirebaseService.getDemandesEntreprises()
    const firebaseDemandeIds = new Set(firebaseDemandes.map(d => d.id))

    for (const demande of localDemandes) {
      try {
        if (firebaseDemandeIds.has(demande.id)) {
          report.stats.demandesEntreprises.skipped++
          continue
        }

        await FirebaseService.saveDemandeEntreprise(demande)
        report.stats.demandesEntreprises.migrated++
        console.log(`✅ Demande entreprise ${demande.id} migrée`)
      } catch (error) {
        report.stats.demandesEntreprises.errors++
        report.errors.push(`Erreur lors de la migration de la demande ${demande.id}: ${error.message}`)
        console.error(`❌ Erreur pour la demande ${demande.id}:`, error)
      }
    }

    // ========== MIGRATION DES CONTRATS ==========
    console.log('📦 Migration des contrats...')
    const localContrats = StorageService.getContrats()
    const firebaseContrats = await FirebaseService.getContrats()
    const firebaseContratIds = new Set(firebaseContrats.map(c => c.id))

    for (const contrat of localContrats) {
      try {
        if (firebaseContratIds.has(contrat.id)) {
          report.stats.contrats.skipped++
          continue
        }

        await FirebaseService.saveContrat(contrat)
        report.stats.contrats.migrated++
        console.log(`✅ Contrat ${contrat.id} migré`)
      } catch (error) {
        report.stats.contrats.errors++
        report.errors.push(`Erreur lors de la migration du contrat ${contrat.id}: ${error.message}`)
        console.error(`❌ Erreur pour le contrat ${contrat.id}:`, error)
      }
    }

    // Résumé final
    const totalMigrated = Object.values(report.stats).reduce((sum, stat) => sum + stat.migrated, 0)
    const totalSkipped = Object.values(report.stats).reduce((sum, stat) => sum + stat.skipped, 0)
    const totalErrors = Object.values(report.stats).reduce((sum, stat) => sum + stat.errors, 0)

    console.log('\n📊 Résumé de la migration:')
    console.log(`✅ ${totalMigrated} éléments migrés`)
    console.log(`⏭️  ${totalSkipped} éléments ignorés (déjà présents)`)
    console.log(`❌ ${totalErrors} erreurs`)

    if (report.errors.length > 0) {
      console.log('\n⚠️  Erreurs rencontrées:')
      report.errors.forEach(error => console.error(`  - ${error}`))
      report.success = false
    }

    return report
  } catch (error) {
    console.error('❌ Erreur fatale lors de la migration:', error)
    report.success = false
    report.errors.push(`Erreur fatale: ${error.message}`)
    return report
  }
}

/**
 * Vérifie s'il y a des données dans localStorage à migrer
 * @returns {Object} Statistiques des données disponibles
 */
export const checkLocalStorageData = () => {
  const stats = {
    users: StorageService.getUsers().length,
    offres: StorageService.getOffres().length,
    candidatures: StorageService.getCandidatures().length,
    messages: StorageService.getMessages().length,
    notifications: StorageService.getNotifications().length,
    demandesEntreprises: StorageService.getDemandesEntreprises().length,
    contrats: StorageService.getContrats().length
  }

  const total = Object.values(stats).reduce((sum, count) => sum + count, 0)

  return {
    stats,
    total,
    hasData: total > 0
  }
}

/**
 * Nettoie le localStorage après migration réussie
 * ATTENTION: Cette fonction supprime définitivement les données du localStorage
 * @returns {boolean} Succès de l'opération
 */
export const clearLocalStorageAfterMigration = () => {
  try {
    const keys = [
      'users',
      'offres',
      'candidatures',
      'messages',
      'notifications',
      'demandes-entreprises',
      'contrats'
    ]

    keys.forEach(key => {
      localStorage.removeItem(key)
    })

    console.log('✅ localStorage nettoyé (données migrées conservées dans Firebase)')
    return true
  } catch (error) {
    console.error('❌ Erreur lors du nettoyage du localStorage:', error)
    return false
  }
}

// Exporter pour utilisation dans la console du navigateur
if (typeof window !== 'undefined') {
  window.migrateToFirebase = migrateLocalStorageToFirebase
  window.checkLocalStorageData = checkLocalStorageData
  window.clearLocalStorageAfterMigration = clearLocalStorageAfterMigration
}

