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

// Utilisateurs de démonstration
const DEMO_USERS = {
  'admin@recrutement.mg': {
    id: 'demo-admin-001',
    email: 'admin@recrutement.mg',
    password: 'admin123',
    nom: 'Administrateur',
    prenom: 'Système',
    role: 'admin',
    createdAt: '2024-01-01T00:00:00.000Z'
  },
  'contact@techmu.mu': {
    id: 'demo-entreprise-001',
    email: 'contact@techmu.mu',
    password: 'entreprise123',
    nom: 'TechMU Ltd',
    prenom: 'Contact',
    role: 'entreprise',
    nomEntreprise: 'TechMU Ltd',
    entreprise: 'TechMU Ltd',
    secteur: 'Construction',
    telephone: '+2301234567',
    adresse: 'Port-Louis, Maurice',
    abonnement: 'Premium',
    statut: 'actif',
    createdAt: '2024-01-15T00:00:00.000Z'
  },
  'jean.rakoto@email.mg': {
    id: 'demo-candidat-001',
    email: 'jean.rakoto@email.mg',
    password: 'candidat123',
    nom: 'Rakoto',
    prenom: 'Jean',
    role: 'candidat',
    createdAt: '2024-02-01T00:00:00.000Z'
  }
}

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
    // Vérifier d'abord si un utilisateur démo est en session
    const demoUserJson = localStorage.getItem('demoUser')
    if (demoUserJson) {
      try {
        const demoUser = JSON.parse(demoUserJson)
        setUser(demoUser)
        setLoading(false)
        return
      } catch (e) {
        localStorage.removeItem('demoUser')
      }
    }

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
    // Vérifier d'abord si c'est un utilisateur de démonstration
    const demoUser = DEMO_USERS[email]
    if (demoUser && demoUser.password === password) {
      const { password: _, ...userWithoutPassword } = demoUser
      const fullUser = { ...userWithoutPassword, uid: demoUser.id, isDemo: true }
      setUser(fullUser)
      // Sauvegarder dans localStorage pour persister la session démo
      localStorage.setItem('demoUser', JSON.stringify(fullUser))
      return { success: true, user: fullUser }
    }

    // Si ce n'est pas un utilisateur démo, essayer Firebase
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
      
      // Vérifier si c'est un email de démo avec mauvais mot de passe
      if (DEMO_USERS[email]) {
        errorMessage = 'Mot de passe incorrect'
        return { success: false, error: errorMessage }
      }
      
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
      // Supprimer la session démo si elle existe
      localStorage.removeItem('demoUser')
      
      // Déconnecter de Firebase si connecté
      if (auth.currentUser) {
        await signOut(auth)
      }
      
      setUser(null)
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error)
      // Forcer la déconnexion même en cas d'erreur
      localStorage.removeItem('demoUser')
      setUser(null)
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







