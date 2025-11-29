import { createContext, useContext, useState, useEffect } from 'react'
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth'
import { auth } from '../config/firebase'
import FirebaseService from '../utils/firebaseService'

const AuthContext = createContext(null)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth doit être utilisé dans un AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Écouter les changements d'état d'authentification Firebase
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Récupérer les données utilisateur depuis Firestore
        const userData = await FirebaseService.getUserById(firebaseUser.uid)
        if (userData) {
          setUser({ ...userData, uid: firebaseUser.uid })
        } else {
          // Si l'utilisateur n'existe pas dans Firestore, créer un profil basique
          const basicUser = {
            id: firebaseUser.uid,
            email: firebaseUser.email,
            role: 'candidat',
            createdAt: new Date().toISOString()
          }
          await FirebaseService.saveUser(basicUser)
          setUser({ ...basicUser, uid: firebaseUser.uid })
        }
      } else {
        setUser(null)
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const login = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      const firebaseUser = userCredential.user
      
      // Récupérer les données utilisateur depuis Firestore
      const userData = await FirebaseService.getUserById(firebaseUser.uid)
      
      if (userData) {
        const fullUser = { ...userData, uid: firebaseUser.uid }
        setUser(fullUser)
        return { success: true, user: fullUser }
      } else {
        // Créer un profil basique si nécessaire
        const basicUser = {
          id: firebaseUser.uid,
          email: firebaseUser.email,
          role: 'candidat',
          createdAt: new Date().toISOString()
        }
        await FirebaseService.saveUser(basicUser)
        const fullUser = { ...basicUser, uid: firebaseUser.uid }
        setUser(fullUser)
        return { success: true, user: fullUser }
      }
    } catch (error) {
      console.error('Erreur lors de la connexion:', error)
      let errorMessage = 'Une erreur est survenue'
      
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        errorMessage = 'Email ou mot de passe incorrect'
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Email invalide'
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = 'Trop de tentatives. Veuillez réessayer plus tard'
      }
      
      return { success: false, error: errorMessage }
    }
  }

  const register = async (userData) => {
    try {
      // Vérifier si l'email existe déjà dans Firestore
      const existingUser = await FirebaseService.getUserByEmail(userData.email)
      if (existingUser) {
        return { success: false, error: 'Cet email est déjà utilisé' }
      }

      // Créer l'utilisateur avec Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(
        auth, 
        userData.email, 
        userData.password
      )
      const firebaseUser = userCredential.user

      // Créer le profil utilisateur dans Firestore
      const newUser = {
        id: firebaseUser.uid,
        email: firebaseUser.email,
        nom: userData.nom,
        prenom: userData.prenom,
        role: userData.role || 'candidat',
        createdAt: new Date().toISOString(),
        ...(userData.telephone && { telephone: userData.telephone }),
        ...(userData.entreprise && { entreprise: userData.entreprise })
      }

      await FirebaseService.saveUser(newUser)
      const fullUser = { ...newUser, uid: firebaseUser.uid }
      setUser(fullUser)

      return { success: true, user: fullUser }
    } catch (error) {
      console.error('Erreur lors de l\'inscription:', error)
      let errorMessage = 'Une erreur est survenue'
      
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'Cet email est déjà utilisé'
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Email invalide'
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'Le mot de passe est trop faible'
      }
      
      return { success: false, error: errorMessage }
    }
  }

  const logout = async () => {
    try {
      await signOut(auth)
      setUser(null)
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error)
    }
  }

  const updateUser = async (updates) => {
    if (!user) return false

    try {
      await FirebaseService.updateUser(user.id, updates)
      const updated = { ...user, ...updates }
      setUser(updated)
      return true
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error)
      return false
    }
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







