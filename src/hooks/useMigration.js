// Hook personnalisé pour gérer la migration des données
import { useState } from 'react'
import { migrateLocalStorageToFirebase, checkLocalStorageData, clearLocalStorageAfterMigration } from '../utils/migrateToFirebase'

export const useMigration = () => {
  const [isMigrating, setIsMigrating] = useState(false)
  const [migrationReport, setMigrationReport] = useState(null)
  const [localData, setLocalData] = useState(null)

  const checkData = () => {
    const data = checkLocalStorageData()
    setLocalData(data)
    return data
  }

  const migrate = async () => {
    setIsMigrating(true)
    setMigrationReport(null)
    
    try {
      const report = await migrateLocalStorageToFirebase()
      setMigrationReport(report)
      return report
    } catch (error) {
      const errorReport = {
        success: false,
        errors: [error.message],
        stats: {}
      }
      setMigrationReport(errorReport)
      return errorReport
    } finally {
      setIsMigrating(false)
    }
  }

  const clearLocalStorage = () => {
    return clearLocalStorageAfterMigration()
  }

  return {
    isMigrating,
    migrationReport,
    localData,
    checkData,
    migrate,
    clearLocalStorage
  }
}

