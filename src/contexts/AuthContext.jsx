import { createContext, useContext, useState, useEffect } from 'react'
import StorageService from '../utils/storageService'

const AuthContext = createContext(null)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth doit être utilisé dans un AuthProvider')
  }
  return context
}

// Hash simple des mots de passe (simulation)
const hashPassword = (password) => {
  let hash = 0
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32bit integer
  }
  return hash.toString()
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Vérifier si un utilisateur est déjà connecté
    const currentUser = StorageService.getCurrentUser()
    if (currentUser) {
      // Vérifier que l'utilisateur existe toujours
      const userData = StorageService.getUserById(currentUser.id)
      if (userData) {
        setUser(userData)
      } else {
        StorageService.clearCurrentUser()
      }
    }
    setLoading(false)
  }, [])

  const login = async (email, password) => {
    try {
      const users = StorageService.getUsers()
      const foundUser = users.find(u => u.email === email)
      
      if (!foundUser) {
        return { success: false, error: 'Email ou mot de passe incorrect' }
      }

      const hashedPassword = hashPassword(password)
      if (foundUser.password !== hashedPassword) {
        return { success: false, error: 'Email ou mot de passe incorrect' }
      }

      // Mettre à jour l'utilisateur dans le storage
      const userData = { ...foundUser }
      StorageService.setCurrentUser(userData)
      setUser(userData)

      return { success: true, user: userData }
    } catch (error) {
      console.error('Erreur lors de la connexion:', error)
      return { success: false, error: 'Une erreur est survenue' }
    }
  }

  const register = async (userData) => {
    try {
      // Vérifier si l'email existe déjà
      const existingUser = StorageService.getUserByEmail(userData.email)
      if (existingUser) {
        return { success: false, error: 'Cet email est déjà utilisé' }
      }

      // Créer le nouvel utilisateur
      const newUser = {
        id: Date.now().toString(),
        ...userData,
        password: hashPassword(userData.password),
        role: userData.role || 'candidat',
        createdAt: new Date().toISOString()
      }

      // Sauvegarder l'utilisateur
      StorageService.saveUser(newUser)
      StorageService.setCurrentUser(newUser)
      setUser(newUser)

      return { success: true, user: newUser }
    } catch (error) {
      console.error('Erreur lors de l\'inscription:', error)
      return { success: false, error: 'Une erreur est survenue' }
    }
  }

  const logout = () => {
    StorageService.clearCurrentUser()
    setUser(null)
  }

  const updateUser = (updates) => {
    if (!user) return false

    const updated = { ...user, ...updates }
    StorageService.updateUser(user.id, updates)
    StorageService.setCurrentUser(updated)
    setUser(updated)
    return true
  }

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updateUser,
    isAuthenticated: !!user,
    isCandidat: user?.role === 'candidat',
    isEntreprise: user?.role === 'entreprise',
    isAdmin: user?.role === 'admin'
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}





