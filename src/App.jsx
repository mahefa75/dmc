import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { LanguageProvider } from './contexts/LanguageContext'
import { DataProvider } from './contexts/DataContext'

// Pages publiques
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import ForgotPassword from './pages/ForgotPassword'
import Contact from './pages/Contact'
import About from './pages/About'
import FAQ from './pages/FAQ'
import PrivacyPolicy from './pages/PrivacyPolicy'
import OffresPublic from './pages/OffresPublic'
import OffreDetail from './pages/OffreDetail'
import CandidatPublic from './pages/CandidatPublic'
import EntreprisePublic from './pages/EntreprisePublic'

// Pages candidat
import CandidatDashboard from './pages/Candidat/Dashboard'
import CandidatProfil from './pages/Candidat/Profil'
import CandidatOffres from './pages/Candidat/Offres'
import CandidatMesCandidatures from './pages/Candidat/MesCandidatures'
import CandidatNotifications from './pages/Candidat/Notifications'
import CandidatMessagerie from './pages/Candidat/Messagerie'

// Pages entreprise
import EntrepriseDashboard from './pages/Entreprise/Dashboard'
import EntrepriseRechercheCV from './pages/Entreprise/RechercheCV'
import EntrepriseProfilCandidat from './pages/Entreprise/ProfilCandidat'
import EntrepriseNouvelleDemande from './pages/Entreprise/NouvelleDemande'
import EntrepriseMesDemandes from './pages/Entreprise/MesDemandes'
import EntrepriseAbonnement from './pages/Entreprise/Abonnement'
import EntrepriseMessagerie from './pages/Entreprise/Messagerie'

// Pages admin
import AdminDashboard from './pages/Admin/Dashboard'
import AdminOffres from './pages/Admin/Offres'
import AdminOffreForm from './pages/Admin/OffreForm'
import AdminCandidats from './pages/Admin/Candidats'
import AdminCandidatForm from './pages/Admin/CandidatForm'
import AdminCandidatures from './pages/Admin/Candidatures'
import AdminDemandesEntreprises from './pages/Admin/DemandesEntreprises'
import AdminEntreprises from './pages/Admin/Entreprises'
import AdminMessagerie from './pages/Admin/Messagerie'
import AdminContrats from './pages/Admin/Contrats'
import AdminFacturation from './pages/Admin/Facturation'
import AdminStatistiques from './pages/Admin/Statistiques'
import AdminUtilisateurs from './pages/Admin/Utilisateurs'

import ProtectedRoute from './components/Layout/ProtectedRoute'
import NotFound from './pages/NotFound'

function App() {
  return (
    <Router>
      <LanguageProvider>
        <AuthProvider>
          <DataProvider>
            <Routes>
              {/* Routes publiques */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/about" element={<About />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/privacy" element={<PrivacyPolicy />} />
              <Route path="/offres" element={<OffresPublic />} />
              <Route path="/offres/:id" element={<OffreDetail />} />
              <Route path="/candidat" element={<CandidatPublic />} />
              <Route path="/entreprise" element={<EntreprisePublic />} />

              {/* Routes candidat */}
              <Route
                path="/candidat/dashboard"
                element={
                  <ProtectedRoute role="candidat">
                    <CandidatDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/candidat/profil"
                element={
                  <ProtectedRoute role="candidat">
                    <CandidatProfil />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/candidat/offres"
                element={
                  <ProtectedRoute role="candidat">
                    <CandidatOffres />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/candidat/offres/:id"
                element={
                  <ProtectedRoute role="candidat">
                    <OffreDetail />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/candidat/candidatures"
                element={
                  <ProtectedRoute role="candidat">
                    <CandidatMesCandidatures />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/candidat/notifications"
                element={
                  <ProtectedRoute role="candidat">
                    <CandidatNotifications />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/candidat/messagerie"
                element={
                  <ProtectedRoute role="candidat">
                    <CandidatMessagerie />
                  </ProtectedRoute>
                }
              />

              {/* Routes entreprise */}
              <Route
                path="/entreprise/dashboard"
                element={
                  <ProtectedRoute role="entreprise">
                    <EntrepriseDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/entreprise/recherche-cv"
                element={
                  <ProtectedRoute role="entreprise">
                    <EntrepriseRechercheCV />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/entreprise/candidat/:id"
                element={
                  <ProtectedRoute role="entreprise">
                    <EntrepriseProfilCandidat />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/entreprise/nouvelle-demande"
                element={
                  <ProtectedRoute role="entreprise">
                    <EntrepriseNouvelleDemande />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/entreprise/demandes"
                element={
                  <ProtectedRoute role="entreprise">
                    <EntrepriseMesDemandes />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/entreprise/abonnement"
                element={
                  <ProtectedRoute role="entreprise">
                    <EntrepriseAbonnement />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/entreprise/messagerie"
                element={
                  <ProtectedRoute role="entreprise">
                    <EntrepriseMessagerie />
                  </ProtectedRoute>
                }
              />

              {/* Routes admin */}
              <Route
                path="/admin/dashboard"
                element={
                  <ProtectedRoute role="admin">
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/offres"
                element={
                  <ProtectedRoute role="admin">
                    <AdminOffres />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/offres/nouvelle"
                element={
                  <ProtectedRoute role="admin">
                    <AdminOffreForm />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/offres/:id/edit"
                element={
                  <ProtectedRoute role="admin">
                    <AdminOffreForm />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/candidats"
                element={
                  <ProtectedRoute role="admin">
                    <AdminCandidats />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/candidats/nouveau"
                element={
                  <ProtectedRoute role="admin">
                    <AdminCandidatForm />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/candidats/:id/edit"
                element={
                  <ProtectedRoute role="admin">
                    <AdminCandidatForm />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/candidatures"
                element={
                  <ProtectedRoute role="admin">
                    <AdminCandidatures />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/demandes-entreprises"
                element={
                  <ProtectedRoute role="admin">
                    <AdminDemandesEntreprises />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/entreprises"
                element={
                  <ProtectedRoute role="admin">
                    <AdminEntreprises />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/messagerie"
                element={
                  <ProtectedRoute role="admin">
                    <AdminMessagerie />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/contrats"
                element={
                  <ProtectedRoute role="admin">
                    <AdminContrats />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/facturation"
                element={
                  <ProtectedRoute role="admin">
                    <AdminFacturation />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/statistiques"
                element={
                  <ProtectedRoute role="admin">
                    <AdminStatistiques />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/utilisateurs"
                element={
                  <ProtectedRoute role="admin">
                    <AdminUtilisateurs />
                  </ProtectedRoute>
                }
              />

              {/* 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </DataProvider>
        </AuthProvider>
      </LanguageProvider>
    </Router>
  )
}

export default App










