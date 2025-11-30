# Plan de développement - Plateforme de recrutement Madagascar-Maurice

## Vue d'ensemble

Création d'un prototype complet de plateforme web de recrutement trilingue (FR/EN/MG) avec React, incluant espaces candidat, entreprise et administrateur, système multilingue, gestion complète des profils, offres, candidatures, messagerie et statistiques.

## Phase 1 : Configuration initiale et infrastructure

### 1.1 Structure du projet
- Créer la structure de dossiers :
  - `/src/components` (composants réutilisables)
  - `/src/pages` (pages principales)
  - `/src/contexts` (Context API)
  - `/src/utils` (utilitaires, services)
  - `/src/data` (données de démonstration)
  - `/src/hooks` (custom hooks)
  - `/public` (assets statiques)

### 1.2 Configuration des dépendances
- Créer `package.json` avec :
  - React 18+
  - React Router DOM
  - Tailwind CSS (via CDN ou PostCSS)
  - Lucide React
- Créer `index.html` avec Tailwind CDN
- Configurer le point d'entrée `src/index.jsx` et `src/App.jsx`

**Statut :** ⏳ En attente

---

## Phase 2 : Système de base et Context API

### 2.1 Service de stockage (StorageService)
- Créer `src/utils/storageService.js` :
  - Fonctions CRUD pour users, offres, candidatures, messages, notifications
  - Utilisation de `localStorage` avec clés structurées
  - Gestion des erreurs et fallbacks

### 2.2 Context d'authentification (AuthContext)
- Créer `src/contexts/AuthContext.jsx` :
  - État utilisateur connecté
  - Fonctions login, logout, register
  - Vérification de session
  - Hash simple des mots de passe

### 2.3 Context multilingue (LanguageContext)
- Créer `src/contexts/LanguageContext.jsx` :
  - État langue actuelle (fr/en/mg)
  - Objet de traductions complet pour toutes les pages
  - Fonction de traduction `t(key)`
  - Persistance dans localStorage

### 2.4 Context de données globales (DataContext)
- Créer `src/contexts/DataContext.jsx` :
  - Chargement initial des données depuis localStorage
  - Fonctions de mise à jour pour toutes les entités
  - Synchronisation avec StorageService

**Statut :** ⏳ En attente

---

## Phase 3 : Composants réutilisables de base

### 3.1 Layout et navigation
- `src/components/Layout/Header.jsx` : Header avec logo, menu, sélecteur langue, notifications, avatar
- `src/components/Layout/Sidebar.jsx` : Sidebar pour dashboards (admin/entreprise/candidat)
- `src/components/Layout/Footer.jsx` : Footer avec liens et informations
- `src/components/Layout/ProtectedRoute.jsx` : Route protégée selon rôle

### 3.2 Composants UI
- `src/components/UI/Button.jsx` : Bouton avec variantes (primary, secondary, success, danger)
- `src/components/UI/Card.jsx` : Carte réutilisable
- `src/components/UI/Modal.jsx` : Modal réutilisable
- `src/components/UI/Input.jsx` : Input avec validation
- `src/components/UI/Select.jsx` : Select dropdown
- `src/components/UI/Badge.jsx` : Badge pour statuts
- `src/components/UI/Toast.jsx` : Système de notifications toast
- `src/components/UI/Table.jsx` : Tableau avec pagination et tri
- `src/components/UI/Pagination.jsx` : Pagination réutilisable
- `src/components/UI/FileUpload.jsx` : Upload de fichiers avec drag & drop

### 3.3 Composants de recherche et filtres
- `src/components/Search/SearchBar.jsx` : Barre de recherche avec debounce
- `src/components/Search/FilterSidebar.jsx` : Sidebar de filtres multiples
- `src/components/Search/FilterChips.jsx` : Chips des filtres actifs

**Statut :** ⏳ En attente

---

## Phase 4 : Pages publiques

### 4.1 Page d'accueil
- `src/pages/Home.jsx` :
  - Hero section avec CTAs
  - Sections : Qui nous sommes, Services, Valeurs, Chiffres clés, Témoignages
  - Footer

### 4.2 Pages candidat/entreprise publiques
- `src/pages/CandidatPublic.jsx` : Présentation + formulaire inscription
- `src/pages/EntreprisePublic.jsx` : Présentation + formulaire demande accès

### 4.3 Page offres publiques
- `src/pages/OffresPublic.jsx` : Liste des offres avec recherche et filtres
- `src/pages/OffreDetail.jsx` : Détail d'une offre (accessible sans connexion)

### 4.4 Page contact
- `src/pages/Contact.jsx` : Formulaire de contact avec validation

### 4.5 Authentification
- `src/pages/Login.jsx` : Connexion (email + password)
- `src/pages/Register.jsx` : Inscription candidat avec validation
- `src/pages/ForgotPassword.jsx` : Récupération mot de passe (simulation)

**Statut :** ⏳ En attente

---

## Phase 5 : Espace candidat

### 5.1 Dashboard candidat
- `src/pages/Candidat/Dashboard.jsx` : Vue d'ensemble avec statistiques et actions rapides

### 5.2 Gestion du profil
- `src/pages/Candidat/Profil.jsx` : Page profil complète avec onglets :
  - Informations personnelles
  - Documents (CV, lettre motivation, CV vidéo)
  - Expériences professionnelles (ajout/suppression dynamique)
  - Diplômes et certifications
  - Compétences et langues
  - Disponibilité

### 5.3 Recherche et candidatures
- `src/pages/Candidat/Offres.jsx` : Liste offres avec recherche avancée, filtres, pagination
- `src/pages/Candidat/OffreDetail.jsx` : Détail offre avec bouton "Postuler en 1 clic"
- `src/pages/Candidat/MesCandidatures.jsx` : Tableau des candidatures avec statuts et filtres

### 5.4 Notifications et messagerie
- `src/pages/Candidat/Notifications.jsx` : Liste des notifications avec marquage lu/non lu
- `src/pages/Candidat/Messagerie.jsx` : Interface messagerie complète (3 colonnes)

**Statut :** ⏳ En attente

---

## Phase 6 : Espace entreprise

### 6.1 Dashboard entreprise
- `src/pages/Entreprise/Dashboard.jsx` : Dashboard avec widgets statistiques, graphiques, activité récente

### 6.2 Base de données CV
- `src/pages/Entreprise/RechercheCV.jsx` : Recherche avancée avec tous les filtres (sidebar)
- `src/pages/Entreprise/ProfilCandidat.jsx` : Visualisation profil candidat détaillé

### 6.3 Demandes de recrutement
- `src/pages/Entreprise/NouvelleDemande.jsx` : Formulaire multi-étapes (5 étapes)
- `src/pages/Entreprise/MesDemandes.jsx` : Suivi des demandes avec tableau Kanban (drag & drop)

### 6.4 Gestion et abonnement
- `src/pages/Entreprise/Abonnement.jsx` : Gestion abonnement, formules, facturation
- `src/pages/Entreprise/Messagerie.jsx` : Messagerie dédiée entreprise

**Statut :** ⏳ En attente

---

## Phase 7 : Espace administrateur

### 7.1 Dashboard admin
- `src/pages/Admin/Dashboard.jsx` : Vue d'ensemble complète avec KPIs, graphiques, alertes

### 7.2 Gestion des offres
- `src/pages/Admin/Offres.jsx` : Liste offres avec actions (créer, modifier, supprimer)
- `src/pages/Admin/OffreForm.jsx` : Formulaire création/modification offre (6 sections)

### 7.3 Gestion des candidats
- `src/pages/Admin/Candidats.jsx` : Liste candidats avec filtres avancés et actions
- `src/pages/Admin/CandidatForm.jsx` : Édition profil candidat avec champs admin (scores, notes internes)
- `src/pages/Admin/CVGenerator.jsx` : Génération CV standardisé PDF (simulation)

### 7.4 Gestion des candidatures
- `src/pages/Admin/Candidatures.jsx` : Vue globale avec gestion des statuts et actions groupées

### 7.5 Gestion des entreprises
- `src/pages/Admin/DemandesEntreprises.jsx` : Validation des demandes d'accès
- `src/pages/Admin/Entreprises.jsx` : Liste entreprises actives avec détails (onglets)

### 7.6 Messagerie admin
- `src/pages/Admin/Messagerie.jsx` : Centre messagerie avec envoi groupé, templates, programmation

### 7.7 Finances et statistiques
- `src/pages/Admin/Contrats.jsx` : Gestion contrats et alertes
- `src/pages/Admin/Facturation.jsx` : Génération factures et suivi paiements
- `src/pages/Admin/Statistiques.jsx` : Rapports et graphiques analytiques

### 7.8 Gestion des accès
- `src/pages/Admin/Utilisateurs.jsx` : Gestion utilisateurs admin et rôles

**Statut :** ⏳ En attente

---

## Phase 8 : Données de démonstration

### 8.1 Génération des données
- `src/data/mockData.js` : Génération de données réalistes :
  - 50+ candidats avec profils variés
  - 10+ entreprises avec abonnements
  - 30+ offres d'emploi
  - 100+ candidatures
  - 50+ messages
  - 30+ notifications par type

### 8.2 Initialisation
- Fonction d'initialisation qui charge les données dans localStorage si vide
- Seed data au premier chargement

**Statut :** ⏳ En attente

---

## Phase 9 : Fonctionnalités transverses

### 9.1 Système de notifications
- `src/components/Notifications/NotificationBell.jsx` : Badge avec compteur
- `src/components/Notifications/NotificationPanel.jsx` : Panneau déroulant
- `src/utils/notificationService.js` : Service de gestion des notifications

### 9.2 Export de données
- `src/utils/exportService.js` : Fonctions export Excel/PDF/CSV (simulation)

### 9.3 Utilitaires
- `src/utils/validation.js` : Fonctions de validation (email, téléphone, etc.)
- `src/utils/formatters.js` : Formatage dates, nombres, devises
- `src/utils/constants.js` : Constantes (secteurs, localisations, etc.)

**Statut :** ⏳ En attente

---

## Phase 10 : Routing et intégration finale

### 10.1 Configuration React Router
- `src/App.jsx` : Configuration complète des routes :
  - Routes publiques
  - Routes protégées par rôle
  - Route 404

### 10.2 Hooks personnalisés
- `src/hooks/useAuth.js` : Hook pour authentification
- `src/hooks/useTranslation.js` : Hook pour traductions
- `src/hooks/useStorage.js` : Hook pour accès storage
- `src/hooks/useDebounce.js` : Hook pour debounce

### 10.3 Styles et responsive
- Vérifier responsive sur toutes les pages
- Appliquer la charte graphique (couleurs, typographie)
- Animations et transitions

**Statut :** ⏳ En attente

---

## Phase 11 : Tests et finalisation

### 11.1 Tests fonctionnels
- Tester tous les flows utilisateurs
- Vérifier la persistance des données
- Tester le système multilingue
- Vérifier les validations de formulaires

### 11.2 Ajustements UX
- Loading states partout
- Empty states avec illustrations
- Error handling
- Confirmations avant actions destructives

### 11.3 Documentation
- README.md avec instructions d'installation et utilisation
- Commentaires dans le code pour logique complexe

**Statut :** ⏳ En attente

---

## Liste des tâches principales

### ✅ Tâches complétées
_Aucune tâche complétée pour le moment_

### 🔄 Tâches en cours
_Aucune tâche en cours pour le moment_

### ⏳ Tâches à faire

1. **setup** - Configuration initiale : structure de dossiers, package.json, index.html, point d'entrée React
2. **storage-service** - Créer StorageService avec fonctions CRUD pour toutes les entités (users, offres, candidatures, messages, notifications)
3. **contexts** - Créer les Context API : AuthContext, LanguageContext, DataContext
4. **components-ui** - Créer composants UI réutilisables : Button, Card, Modal, Input, Select, Badge, Toast, Table, Pagination, FileUpload
5. **layout** - Créer composants Layout : Header, Sidebar, Footer, ProtectedRoute
6. **pages-public** - Créer pages publiques : Home, CandidatPublic, EntreprisePublic, OffresPublic, OffreDetail, Contact, Login, Register, ForgotPassword
7. **espace-candidat** - Créer espace candidat : Dashboard, Profil (toutes sections), Offres, MesCandidatures, Notifications, Messagerie
8. **espace-entreprise** - Créer espace entreprise : Dashboard, RechercheCV, ProfilCandidat, NouvelleDemande, MesDemandes (Kanban), Abonnement, Messagerie
9. **espace-admin** - Créer espace admin : Dashboard, Offres, Candidats, Candidatures, DemandesEntreprises, Entreprises, Messagerie, Contrats, Facturation, Statistiques, Utilisateurs
10. **mock-data** - Créer données de démonstration : 50+ candidats, 10+ entreprises, 30+ offres, 100+ candidatures, 50+ messages, notifications
11. **routing** - Configurer React Router avec toutes les routes (publiques et protégées) et intégration finale
12. **finalisation** - Tests fonctionnels, ajustements UX (loading/empty/error states), responsive, documentation README

---

## Notes et remarques

- Utiliser Tailwind CSS via CDN (pas de compilation custom)
- Toutes les données stockées dans localStorage via `window.storage`
- Système multilingue complet (FR/EN/MG) avec persistance
- Prioriser l'expérience utilisateur intuitive et professionnelle
- Tous les composants doivent être responsive (mobile-first)

---

## Légende des statuts

- ⏳ En attente
- 🔄 En cours
- ✅ Complété
- ❌ Bloqué
- ⚠️ À revoir










