# Plateforme de Recrutement Madagascar-Maurice

Plateforme web de recrutement trilingue (Français/Anglais/Malgache) pour le recrutement de travailleurs manuels malgaches vers des entreprises mauriciennes.

## Technologies

- **React 18** avec hooks
- **React Router DOM** pour la navigation
- **Tailwind CSS** (via CDN) pour le styling
- **Lucide React** pour les icônes
- **Context API** pour la gestion d'état globale
- **LocalStorage** pour la persistance des données

## Installation

```bash
npm install
```

## Développement

```bash
npm run dev
```

L'application sera accessible sur `http://localhost:3000`

## Build

```bash
npm run build
```

## Structure du projet

```
src/
├── components/     # Composants réutilisables
├── pages/         # Pages principales
├── contexts/      # Context API (Auth, Language, Data)
├── utils/         # Utilitaires et services
├── data/          # Données de démonstration
├── hooks/         # Custom hooks
└── App.jsx        # Point d'entrée principal
```

## Fonctionnalités

### Espace Candidat
- Inscription et authentification
- Création et gestion de profil complet
- Recherche et consultation d'offres
- Candidatures en 1 clic
- Suivi des candidatures
- Notifications et messagerie

### Espace Entreprise
- Demande d'accès et validation
- Dashboard avec statistiques
- Base de données CV avec recherche avancée
- Demandes de recrutement spécifiques
- Suivi du processus de recrutement (Kanban)
- Gestion d'abonnement et facturation
- Messagerie interne

### Espace Administrateur
- Dashboard global avec KPIs
- Gestion des offres d'emploi
- Gestion des profils candidats
- Gestion des candidatures
- Validation des entreprises
- Messagerie avec templates
- Gestion des contrats et facturation
- Statistiques et rapports
- Gestion des accès et rôles

## Langues supportées

- Français (fr)
- Anglais (en)
- Malgache (mg)

## Stockage des données

Toutes les données sont stockées dans le localStorage du navigateur via le service `StorageService`.

## Notes

Ceci est un prototype fonctionnel. Les données sont persistées localement dans le navigateur.






