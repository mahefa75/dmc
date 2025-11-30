import { createContext, useContext, useState, useEffect } from 'react'
import StorageService from '../utils/storageService'
import { translations } from '../utils/translations'

const LanguageContext = createContext(null)

export const useLanguage = () => {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage doit être utilisé dans un LanguageProvider')
  }
  return context
}

export const LanguageProvider = ({ children }) => {
  const [currentLang, setCurrentLang] = useState('fr')

  useEffect(() => {
    // Charger la langue depuis localStorage
    const savedLang = StorageService.getCurrentLang()
    if (savedLang && ['fr', 'en', 'mg'].includes(savedLang)) {
      setCurrentLang(savedLang)
    }
  }, [])

  const changeLanguage = (lang) => {
    if (['fr', 'en', 'mg'].includes(lang)) {
      setCurrentLang(lang)
      StorageService.setCurrentLang(lang)
    }
  }

  // Fonction de traduction avec support des clés imbriquées
  const t = (key) => {
    const keys = key.split('.')
    let value = translations[currentLang]
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k]
      } else {
        // Fallback vers le français si la traduction n'existe pas
        value = translations.fr
        for (const k2 of keys) {
          if (value && typeof value === 'object' && k2 in value) {
            value = value[k2]
          } else {
            return key // Retourner la clé si aucune traduction trouvée
          }
        }
        break
      }
    }
    
    return typeof value === 'string' ? value : key
  }

  const value = {
    currentLang,
    changeLanguage,
    t,
    translations: translations[currentLang]
  }

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}










