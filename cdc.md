Crée un prototype complet et entièrement fonctionnel d'une plateforme web de recrutement trilingue (Français/Anglais/Malgache) pour le recrutement de travailleurs manuels malgaches vers des entreprises mauriciennes. Le système doit être développé en React avec les spécifications techniques suivantes :

## ARCHITECTURE TECHNIQUE

### Technologies requises :
- **React** avec hooks (useState, useEffect, useContext, useReducer)
- **React Router** pour la navigation multi-pages
- **Tailwind CSS** (classes utilitaires uniquement, pas de compilation custom)
- **Lucide React** pour les icônes
- **Context API** pour la gestion d'état globale (authentification, langue, données)
- **Local Storage API** (`window.storage`) pour la persistance des données

### Structure de données :
```javascript
// Utilisateurs (candidats, entreprises, administrateurs)
{
  id, email, password, role: 'candidat'|'entreprise'|'admin',
  nom, prenom, telephone, 
  // Pour candidats uniquement :
  photo, cv, lettreMotivation, experiences[], diplomes[], langues[],
  disponibilite, cvVideo, statut,
  // Pour entreprises uniquement :
  nomEntreprise, secteur, abonnement, dateDebut, dateFin
}

// Offres d'emploi
{
  id, titre, secteur, localisation, typeContrat, description,
  competencesRequises[], languesRequises[], experienceMin,
  salaire, datePublication, dateExpiration, statut, image, logo
}

// Candidatures
{
  id, candidatId, offreId, dateCandidature,
  statut: 'en_attente'|'selectionne'|'refuse'|'entretien',
  notes, documentsSupplementaires[]
}

// Messages
{
  id, expediteurId, destinataireId, sujet, contenu,
  dateEnvoi, lu, pieceJointe
}

// Demandes de recrutement (entreprises → admin)
{
  id, entrepriseId, posteRecherche, profilSouhaite,
  urgence, delai, fichePoste, statut, dateCreation
}
```

## SYSTÈME MULTILINGUE

### Implémentation :
- Créer un Context `LanguageContext` avec état `currentLang: 'fr'|'en'|'mg'`
- Objet de traductions pour TOUS les textes de l'interface :
```javascript
const translations = {
  fr: {
    nav: { home: 'Accueil', candidat: 'Candidat', entreprise: 'Entreprise', login: 'Connexion', contact: 'Contact' },
    home: { title: 'Plateforme de recrutement Madagascar-Maurice', subtitle: '...' },
    // ... toutes les traductions
  },
  en: { /* traductions anglaises complètes */ },
  mg: { /* traductions malgaches complètes */ }
}
```
- Sélecteur de langue dans le header avec drapeaux/codes
- Persister la langue sélectionnée dans localStorage

## ESPACE CANDIDAT - FONCTIONNALITÉS DÉTAILLÉES

### 1. Inscription et Authentification
- Formulaire d'inscription avec validation :
  - Nom, Prénom (requis, min 2 caractères)
  - Email (validation format email)
  - Téléphone (format international +261...)
  - Mot de passe (min 8 caractères, cryptage simulé avec hash)
  - Confirmation mot de passe
- Connexion avec email + mot de passe
- Récupération mot de passe par email (simulation)
- Déconnexion avec confirmation

### 2. Création et Gestion du Profil
**Page profil complète avec sections :**

**A. Informations personnelles**
- Photo de profil (upload simulé avec aperçu base64)
- Nom, Prénom, Email, Téléphone
- Date de naissance, Sexe
- Adresse complète (ville, région, pays)

**B. Documents**
- Upload CV (PDF/Word) avec prévisualisation du nom de fichier
- Upload Lettre de motivation
- CV Vidéo optionnel (upload vidéo ou enregistrement simulé)

**C. Expériences professionnelles** (section dynamique - ajout/suppression)
- Poste occupé
- Entreprise
- Dates (début - fin)
- Description des tâches
- Secteur d'activité

**D. Diplômes et Certifications** (section dynamique)
- Intitulé du diplôme
- Établissement
- Année d'obtention
- Niveau (CAP, BEP, BAC, Licence, Master...)

**E. Compétences et Langues**
- Langues parlées avec niveau (Débutant, Intermédiaire, Avancé, Courant, Natif)
- Compétences techniques (liste avec tags)
- Permis de conduire (A, B, C, D)

**F. Disponibilité**
- Immédiate / Sous 1 mois / Sous 3 mois / À discuter
- Mobilité géographique
- Type de contrat recherché (CDI, CDD, Intérim, Saisonnier)

### 3. Recherche et Consultation d'Offres
**Page liste des offres avec :**
- Barre de recherche intelligente (recherche dans titre, description, secteur)
- Filtres multiples (sidebar ou dropdowns) :
  - Secteur d'activité (Construction, Hôtellerie, Agriculture, Manufacture, Logistique, Nettoyage, Sécurité, Autre)
  - Localisation à Maurice (Port-Louis, Curepipe, Quatre-Bornes, Flic-en-Flac, Grand-Baie, etc.)
  - Type de contrat (CDI, CDD, Intérim, Saisonnier)
  - Salaire minimum
  - Date de publication (Dernières 24h, 7 jours, 30 jours)
- Affichage en grille/liste des offres avec :
  - Logo entreprise / Image
  - Titre du poste
  - Entreprise
  - Localisation
  - Salaire
  - Date de publication
  - Badge statut (Nouveau, Urgent)
- Pagination (20 offres par page)
- Tri (Plus récent, Salaire croissant/décroissant, Pertinence)

### 4. Détail d'une Offre et Candidature
**Page détail offre avec :**
- En-tête : Titre, Entreprise, Localisation, Salaire, Type contrat
- Image/Bannière de l'offre
- Description complète du poste
- Compétences requises (tags)
- Langues requises avec niveaux
- Expérience minimale requise
- Profil recherché
- Conditions de travail
- Avantages
- Date limite de candidature
- **Bouton "Postuler en 1 clic"** :
  - Vérification connexion (sinon redirection login)
  - Vérification profil complété (alerte si incomplet)
  - Confirmation de candidature avec modal
  - Envoi automatique avec CV et lettre de motivation du profil
  - Notification de confirmation

### 5. Suivi des Candidatures
**Page "Mes Candidatures" avec tableau détaillé :**
- Liste de toutes les candidatures avec :
  - Poste
  - Entreprise
  - Date de candidature
  - Statut avec badge coloré :
    - 🟡 En attente (jaune)
    - 🟢 Présélectionné (vert)
    - 🔵 Entretien planifié (bleu)
    - ✅ Sélectionné (vert foncé)
    - ❌ Refusé (rouge)
  - Actions (Voir détails, Retirer candidature)
- Filtres par statut
- Historique complet avec timeline
- Notifications intégrées

### 6. Notifications et Messagerie
**Système de notifications :**
- Badge avec compteur sur icône cloche
- Panneau déroulant avec liste des notifications :
  - Nouvelles offres correspondant au profil
  - Changement de statut de candidature
  - Messages reçus de l'administrateur
  - Rappels (documents à fournir, entretien)
  - Date et heure
  - Marquer comme lu
- Simulation d'envoi SMS/WhatsApp (console log)

**Messagerie interne :**
- Boîte de réception des messages
- Liste des conversations
- Vue détaillée message avec :
  - Expéditeur
  - Date/heure
  - Sujet
  - Contenu
  - Pièces jointes téléchargeables
- Répondre à un message
- Archiver/Supprimer

## ESPACE ENTREPRISE - FONCTIONNALITÉS DÉTAILLÉES

### 1. Processus d'Accès Spécifique
**Page de demande d'accès (non connecté) :**
- Formulaire détaillé :
  - Nom de l'entreprise
  - Secteur d'activité
  - Adresse complète à Maurice
  - Nom et prénom du contact
  - Fonction du contact
  - Email professionnel
  - Téléphone
  - Nombre d'employés
  - Besoins en recrutement (description)
  - Upload KBIS ou document d'enregistrement
- Message : "Votre demande sera examinée sous 48h"
- Validation manuelle par administrateur requise

**Après validation :**
- Email de confirmation avec identifiants temporaires
- Première connexion → changement mot de passe obligatoire

### 2. Tableau de Bord Entreprise
**Dashboard complet avec widgets :**
- **Statistiques en carte :**
  - Nombre de recrutements en cours
  - Candidats présélectionnés
  - Entretiens planifiés
  - Postes pourvus ce mois
- **Graphiques :**
  - Évolution des recrutements (ligne)
  - Répartition par statut (camembert)
  - Candidatures par secteur (barres)
- **Activité récente :**
  - Nouveaux profils correspondants
  - Candidatures reçues
  - Messages de l'administrateur
- **Raccourcis rapides :**
  - Nouvelle demande de recrutement
  - Accéder à la base CV
  - Voir les entretiens de la semaine
- **Alertes :**
  - Fin d'abonnement proche
  - Documents manquants
  - Entretiens à venir

### 3. Base de Données CV - Recherche Avancée
**Page de recherche sophistiquée :**

**Moteur de recherche avec filtres multiples (sidebar) :**
- **Recherche textuelle :** Mots-clés dans CV, compétences, expériences
- **Filtres démographiques :**
  - Sexe (H/F/Autre)
  - Tranche d'âge (18-25, 26-35, 36-45, 46+)
  - Localisation actuelle à Madagascar
- **Filtres professionnels :**
  - Secteur d'expérience (multi-sélection)
  - Années d'expérience (0-2, 2-5, 5-10, 10+)
  - Niveau d'études (Sans diplôme, CAP/BEP, BAC, BAC+2, BAC+3+)
  - Poste recherché
- **Filtres linguistiques :**
  - Français (niveau min)
  - Anglais (niveau min)
  - Autres langues
- **Filtres de disponibilité :**
  - Disponibilité immédiate uniquement
  - Type de contrat accepté
  - Mobilité internationale
- **Filtres spécifiques :**
  - Permis de conduire
  - Certifications particulières
  - Expérience à Maurice

**Affichage des résultats :**
- Grille de cartes profil avec :
  - Photo
  - Nom Prénom (ou anonymisé selon paramètres)
  - Âge et localisation
  - Poste actuel/recherché
  - Années d'expérience totales
  - Langues avec niveaux (badges)
  - Disponibilité
  - Score de correspondance (%)
  - Boutons : Voir profil détaillé, Ajouter aux favoris, Contacter
- Tri : Pertinence, Expérience, Date d'inscription, Disponibilité
- Export sélection (Excel/PDF)
- Sauvegarde de recherches

### 4. Visualisation de Profil Candidat
**Page profil détaillé avec sections :**
- **En-tête :**
  - Photo professionnelle
  - Nom, Prénom, Âge
  - Localisation
  - Disponibilité
  - Contact (email, téléphone - si autorisé)
  - Boutons d'action : Télécharger CV, Contacter, Ajouter favoris, Proposer entretien

- **Résumé professionnel :**
  - Texte rédigé/validé par administrateur
  - Points forts
  - Objectif professionnel

- **Expérience professionnelle :**
  - Timeline avec toutes les expériences
  - Durée, poste, entreprise, missions

- **Formation et certifications :**
  - Liste des diplômes
  - Certifications professionnelles
  - Formations continues

- **Compétences :**
  - Techniques (barres de progression)
  - Langues (niveaux avec badges)
  - Soft skills

- **Documents téléchargeables :**
  - CV format standardisé (généré automatiquement)
  - CV original uploadé
  - Lettre de motivation
  - Certificats

- **CV Vidéo :** (si disponible)
  - Lecteur vidéo intégré

- **Historique de recrutement :**
  - Candidatures précédentes (si autorisé)
  - Feedbacks d'autres entreprises (anonymisés)

### 5. Demande de Recrutement Spécifique
**Formulaire détaillé en plusieurs étapes :**

**Étape 1 : Informations sur le poste**
- Intitulé du poste
- Secteur d'activité
- Localisation du poste à Maurice
- Type de contrat (CDI, CDD, durée)
- Date de prise de fonction souhaitée
- Nombre de postes à pourvoir
- Salaire proposé (fourchette)

**Étape 2 : Profil recherché**
- Niveau d'études minimum
- Années d'expérience requises
- Compétences techniques obligatoires (multi-sélection)
- Compétences souhaitées (bonus)
- Langues requises avec niveaux
- Âge souhaité (fourchette)
- Sexe (si pertinent pour le poste)

**Étape 3 : Description détaillée**
- Description du poste (éditeur riche)
- Missions principales
- Responsabilités
- Conditions de travail
- Avantages offerts
- Évolution de carrière possible

**Étape 4 : Documents et urgence**
- Upload fiche de poste officielle (PDF)
- Upload autres documents (contrat type, présentation entreprise)
- Niveau d'urgence (Normal, Urgent, Très urgent)
- Délai de recrutement souhaité
- Budget alloué au recrutement

**Étape 5 : Validation**
- Récapitulatif complet
- Conditions d'utilisation
- Signature électronique (case à cocher + nom)
- Envoi de la demande

**Après envoi :**
- Confirmation avec numéro de demande
- Email automatique de confirmation
- Affichage dans le tableau de suivi des demandes

### 6. Suivi du Processus de Recrutement
**Page de gestion avec tableau Kanban :**

**Colonnes de statut :**
1. **Demande envoyée** : Demandes en attente de traitement admin
2. **Présélection** : Profils proposés par l'administrateur
3. **Entretien planifié** : Candidats retenus pour entretien
4. **Validation** : En attente de décision finale
5. **Documents** : Finalisation administrative
6. **Finalisé** : Recrutement terminé

**Pour chaque candidat/demande :**
- Carte déplaçable par drag & drop
- Photo et nom du candidat
- Poste concerné
- Date de début du processus
- Boutons : Voir profil, Planifier entretien, Refuser, Valider
- Notes privées (zone de texte)
- Documents associés
- Historique des actions

**Fonctionnalités supplémentaires :**
- Agenda des entretiens intégré (vue calendrier)
- Notifications automatiques à chaque changement de statut
- Export du pipeline de recrutement
- Statistiques par demande (temps moyen, taux de conversion)

### 7. Gestion d'Abonnement et Paiement
**Page abonnement avec :**
- Formules disponibles :
  - **Basique** : X CV consultables/mois
  - **Standard** : Y CV + messagerie illimitée
  - **Premium** : Accès illimité + support prioritaire
- Affichage abonnement actuel :
  - Formule souscrite
  - Date de début et fin
  - Nombre de consultations restantes
  - Historique de facturation
- Upgrade/Downgrade d'abonnement
- Facturation automatique (simulation)
- Paiement par candidat retenu :
  - Liste des recrutements finalisés
  - Montant par recrutement
  - Statut paiement
  - Téléchargement factures

### 8. Messagerie Entreprise
**Messagerie dédiée avec :**
- **Conversations avec l'administrateur :**
  - Demandes d'informations
  - Support technique
  - Négociations
- **Proposition de profils par l'admin :**
  - Messages avec profils attachés
  - Prévisualisation inline
  - Réponse rapide (Intéressé/Pas intéressé)
- **Notifications intégrées**
- **Historique complet**
- **Pièces jointes** (contrats, fiches de poste, documents)

## ESPACE ADMINISTRATEUR - FONCTIONNALITÉS DÉTAILLÉES

### 1. Dashboard Administrateur Global
**Vue d'ensemble complète avec :**

**Statistiques clés (cartes) :**
- Nombre total de candidats inscrits
- Nombre d'entreprises clientes
- Offres d'emploi actives
- Candidatures ce mois
- Taux de placement (%)
- Revenus du mois

**Graphiques analytiques :**
- Évolution des inscriptions candidats (ligne, 12 mois)
- Candidatures par secteur (barres horizontales)
- Taux de conversion par offre (%)
- Répartition géographique des candidats (carte)
- Performance des offres (tableau)

**Activité récente (timeline) :**
- Nouvelles inscriptions candidats
- Nouvelles demandes entreprises
- Candidatures soumises
- Changements de statut
- Messages reçus

**Alertes et tâches :**
- Demandes d'accès entreprise en attente (badge rouge)
- Candidatures à traiter
- Contrats arrivant à échéance
- Documents manquants
- Messages non lus

**Raccourcis rapides :**
- Créer une offre
- Valider une demande entreprise
- Voir les messages
- Export données

### 2. Gestion des Offres d'Emploi
**Page liste des offres avec :**
- Tableau complet avec colonnes :
  - ID
  - Titre du poste
  - Entreprise
  - Secteur
  - Localisation
  - Date de publication
  - Date d'expiration
  - Statut (Active, Brouillon, Expirée, Pourvue)
  - Nombre de candidatures
  - Actions (Modifier, Dupliquer, Désactiver, Supprimer, Statistiques)
- Filtres : Statut, Secteur, Entreprise, Date
- Recherche textuelle
- Tri par colonne
- Actions groupées (Activer/Désactiver plusieurs)

**Création/Modification d'offre (formulaire complet) :**

**Section 1 : Informations générales**
- Titre du poste
- Entreprise (sélection depuis liste)
- Secteur d'activité (dropdown)
- Localisation à Maurice (multi-sélection possible)
- Type de contrat
- Salaire (min-max avec devise)
- Nombre de postes

**Section 2 : Description**
- Description détaillée (éditeur riche avec formatting)
- Missions principales (liste à puces)
- Responsabilités
- Conditions de travail (horaires, environnement)
- Avantages (logement, transport, assurance, etc.)

**Section 3 : Profil recherché**
- Expérience minimale requise (années)
- Niveau d'études minimum
- Compétences requises (tags avec autocomplétion)
- Langues requises avec niveaux
- Certifications nécessaires
- Qualités personnelles

**Section 4 : Médias**
- Upload logo entreprise
- Upload image/bannière de l'offre
- Galerie d'images (environnement travail, équipe)
- Vidéo de présentation (URL YouTube/Vimeo)

**Section 5 : Paramètres de publication**
- Date de publication :
  - Immédiate
  - Programmée (sélecteur date/heure)
- Date d'expiration
- Visibilité :
  - Publique (tous candidats)
  - Restreinte (candidats présélectionnés)
  - Interne (base admin uniquement)
- Mise en avant (boost, urgent, featured)

**Section 6 : Notifications**
- Envoyer notification email aux candidats correspondants
- Envoyer SMS aux candidats inscrits au secteur
- Notification WhatsApp (simulation)

**Preview en temps réel** de l'offre telle que vue par les candidats

**Sauvegarde :**
- Brouillon (sauvegarde automatique)
- Publier immédiatement
- Programmer publication

### 3. Gestion des Profils Candidats
**Page liste candidats avec tableau avancé :**

**Colonnes :**
- Photo
- Nom complet
- Âge
- Localisation
- Poste recherché
- Expérience (années)
- Langues (badges)
- Disponibilité
- Score/Notation interne
- Date d'inscription
- Statut (Actif, En attente validation, Incomplet, Désactivé)
- Actions

**Filtres avancés :**
- Tous les filtres de recherche disponibles aux entreprises
- Statut de profil
- Date d'inscription
- Score minimum
- A un CV / Sans CV
- A postulé récemment

**Actions sur les candidats :**
- Voir profil complet
- Modifier profil
- Valider profil
- Désactiver/Activer
- Supprimer (avec confirmation)
- Envoyer message
- Proposer à une entreprise
- Attribuer note/score
- Ajouter tags

**Création/Modification de profil candidat :**
- Formulaire identique à celui du candidat mais avec champs supplémentaires admin :
  - **Résumé professionnel** (rédigé par admin, visible aux entreprises)
  - **Score de fiabilité** (1-10)
  - **Score de motivation** (1-10)
  - **Notes internes** (privées, non visibles)
  - **Tags internes** (présélectionné, fiable, recommandé, etc.)
  - **Statut de validation**
  - **Historique des modifications**

**Upload et édition des CV :**
- Section dédiée "Gestion des documents"
- Upload CV pour le candidat
- Génération automatique CV standardisé :
  - Template professionnel unifié
  - Format PDF
  - Informations structurées : En-tête, Résumé, Expériences, Formation, Compétences, Langues
  - Logo de la plateforme
  - QR code vers profil en ligne
- Prévisualisation du CV généré
- Téléchargement/Remplacement
- Historique des versions

**Classement et catégorisation :**
- Attribution automatique par secteur
- Création de listes personnalisées (pools de talents)
- Export de sélections

### 4. Gestion des Candidatures
**Vue globale des candidatures avec :**

**Tableau de bord candidatures :**
- Toutes les candidatures du système
- Filtres :
  - Par offre
  - Par candidat
  - Par entreprise
  - Par statut
  - Par date
- Colonnes :
  - ID candidature
  - Candidat (photo + nom)
  - Offre (titre)
  - Entreprise
  - Date de candidature
  - Statut actuel
  - Dernière action
  - Actions

**Gestion des statuts :**
- Changement de statut avec menu dropdown :
  - En attente → Présélectionné
  - Présélectionné → Entretien
  - Entretien → Sélectionné / Refusé
- Ajout de notes à chaque changement de statut
- Notification automatique :
  - Au candidat (email + SMS simulé)
  - À l'entreprise (si changement pertinent)
- Historique complet des changements

**Actions groupées :**
- Changer statut de plusieurs candidatures
- Envoyer message groupé
- Export sélection
- Archivage

**Statistiques par offre :**
- Nombre de candidatures reçues
- Répartition par statut (graphique)
- Temps moyen par étape
- Taux de conversion
- Candidats les plus pertinents (scoring auto)

### 5. Validation et Gestion des Entreprises
**Page des demandes d'accès entreprise :**

**Liste des demandes en attente :**
- Tableau avec :
  - Date de demande
  - Nom entreprise
  - Secteur
  - Contact
  - Email/Téléphone
  - Documents fournis
  - Actions (Voir détails, Accepter, Refuser)

**Détail d'une demande :**
- Toutes les informations du formulaire
- Visualisation documents (KBIS, etc.)
- Vérifications admin :
  - Checklist validation (documents OK, infos vérifiées, etc.)
  - Notes internes
  - Historique des communications
- Actions :
  - **Accepter** :
    - Génération identifiants de connexion
    - Envoi email automatique avec identifiants temporaires
    - Attribution formule d'abonnement
    - Définition date de début/fin
  - **Refuser** :
    - Raison du refus (dropdown + texte libre)
    - Email automatique de refus (personnalisable)
  - **Demander complément** :
    - Message avec liste des documents/infos manquants

**Gestion des entreprises actives :**
- Liste de toutes les entreprises clientes
- Tableau avec :
  - Nom entreprise
  - Secteur
  - Contact
  - Formule d'abonnement
  - Date de début
  - Date de fin
  - Statut (Actif, Expiré, Suspendu)
  - Nombre de recrutements
  - CA généré
  - Actions

**Détail entreprise :**
- Onglet **Informations** :
  - Toutes les données entreprise (modifiables)
  - Historique des modifications
- Onglet **Abonnement** :
  - Formule actuelle
  - Historique des abonnements
  - Facturation
  - Modifier/Renouveler abonnement
  - Suspendre/Réactiver compte
- Onglet **Activité** :
  - Liste des demandes de recrutement
  - Statistiques d'utilisation
  - CV consultés
  - Messages échangés
- Onglet **Facturation** :
  - Factures émises
  - Paiements reçus
  - Relances automatiques
  - Génération de facture manuelle

### 6. Messagerie Interne Administrateur
**Centre de messagerie complet :**

**Vue d'ensemble :**
- Boîte de réception (tous messages)
- Messages envoyés
- Brouillons
- Archivés
- Corbeille

**Envoi de messages :**
- **Destinataires multiples** :
  - Un candidat spécifique
  - Une entreprise spécifique
  - Groupe de candidats (avec filtres)
  - Toutes les entreprises
  - Listes personnalisées
- **Composition** :
  - Sujet
  - Contenu (éditeur riche)
  - Pièces jointes (multiple)
  - Variables dynamiques (nom, prénom, poste, etc.)
  - Templates prédéfinis :
    - Convocation entretien
    - Demande de documents
    - Confirmation de candidature
    - Rejet poli
    - Proposition de profil
- **Programmation** :
  - Envoi immédiat
  - Envoi programmé (date/heure)
- **Suivi** :
  - Accusé de réception
  - Taux d'ouverture
  - Clics sur liens

**Templates de messages :**
- Bibliothèque de templates modifiables
- Catégories : Candidats, Entreprises, Général
- Variables dynamiques insérables
- Création de nouveaux templates

**Messages reçus :**
- Liste avec filtres (Candidats, Entreprises, Non lus, Importants)
- Marquage (Lu/Non lu, Important, Archivé)
- Réponse rapide
- Transfert
- Conversion en tâche

### 7. Suivi des Contrats et Paiements
**Module de gestion financière :**

**Tableau de bord financier :**
- KPIs :
  - Revenus du mois
  - Revenus de l'année
  - Abonnements actifs
  - Taux de renouvellement
  - Impayés
  - Prévisionnel

**Gestion des contrats :**
- Liste de tous les contrats entreprises
- Tableau avec :
  - Entreprise
  - Type de contrat (Abonnement, Par recrutement, Mixte)
  - Montant mensuel
  - Date de début
  - Date de fin
  - Renouvellement auto (Oui/Non)
  - Statut (Actif, Échu, À renouveler)
  - Jours restants
  - Actions

**Alertes automatiques :**
- Contrats arrivant à échéance (30j, 15j, 7j, J-1)
- Paiements en retard
- Renouvellements automatiques à venir
- Dépassement de quota (consultations CV)

**Facturation :**
- Génération automatique de factures :
  - Modèle personnalisable
  - Numérotation automatique
  - Calcul automatique (abonnement + recrutements)
  - TVA applicable
  - Conditions de paiement
- Envoi automatique par email
- Suivi des paiements :
  - Statut (En attente, Payée, En retard)
  - Relances automatiques (J+7, J+14, J+30)
  - Historique des relances
- Exports comptables (Excel, CSV)

**Paiement par candidat retenu :**
- Liste des recrutements finalisés non facturés
- Montant par recrutement (selon contrat)
- Génération facture groupée ou individuelle
- Suivi des commissions

**Statistiques financières :**
- Graphiques :
  - Évolution du CA (mois, trimestre, année)
  - Répartition revenus (abonnements vs recrutements)
  - Entreprises les plus rentables
  - Taux d'impayés
- Export de rapports financiers

### 8. Statistiques et Rapports
**Module d'analytique avancé :**

**Section Candidats :**
- Nombre total d'inscrits (évolution)
- Taux de profils complets vs incomplets
- Répartition par :
  - Âge (histogramme)
  - Sexe (camembert)
  - Localisation à Madagascar (carte)
  - Niveau d'études (barres)
  - Secteurs d'expérience (barres)
  - Langues maîtrisées
- Top 10 des postes recherchés
- Taux de candidatures par candidat (moyenne)
- Candidats les plus actifs

**Section Offres :**
- Nombre total d'offres publiées (période)
- Offres actives vs pourvues vs expirées
- Répartition par :
  - Secteur
  - Type de contrat
  - Localisation
  - Fourchette salariale
- Offres les plus populaires (nombre candidatures)
- Taux de pourvoi par secteur
- Temps moyen pour pourvoir un poste
- Taux de candidatures par offre (moyenne)

**Section Candidatures :**
- Nombre total de candidatures (période)
- Répartition par statut (funnel de conversion)
- Taux de conversion :
  - Candidature → Présélection (%)
  - Présélection → Entretien (%)
  - Entretien → Sélection (%)
  - Global (Candidature → Sélection)
- Temps moyen par étape
- Candidatures par secteur
- Candidatures par offre (moyenne)

**Section Entreprises :**
- Nombre d'entreprises clientes (évolution)
- Répartition par secteur
- Taux d'activité (actives vs inactives)
- Nombre moyen de recrutements par entreprise
- Satisfaction client (si système de notation)
- Taux de renouvellement d'abonnement

**Section Performance globale :**
- Taux de placement global (%)
- Délai moyen de placement (jours)
- Secteurs les plus actifs
- Saisonnalité (graphique sur 12 mois)
- Comparaison année N vs année N-1

**Exports et rapports :**
- Export de tous les graphiques (PNG, PDF)
- Génération de rapports personnalisés :
  - Sélection de métriques
  - Période
  - Format (PDF, Excel)
- Rapports prédéfinis :
  - Rapport mensuel complet
  - Rapport trimestriel
  - Rapport annuel
- Planification d'envoi automatique de rapports

### 9. Gestion des Accès et Rôles
**Système de permissions avancé :**

**Rôles prédéfinis :**
- **Super Admin** : Tous les droits
- **Admin** : Gestion quotidienne (sans finances)
- **Modérateur** : Validation des profils et offres
- **Agent terrain** : Création/édition profils candidats uniquement
- **Support** : Messagerie et assistance uniquement

**Création de rôles personnalisés :**
- Nom du rôle
- Description
- Permissions détaillées (checkboxes) :
  - **Candidats** : Voir, Créer, Modifier, Supprimer, Valider
  - **Offres** : Voir, Créer, Modifier, Supprimer, Publier
  - **Candidatures** : Voir, Modifier statut, Supprimer
  - **Entreprises** : Voir, Créer, Modifier, Supprimer, Valider
  - **Messagerie** : Voir, Envoyer candidats, Envoyer entreprises
  - **Finances** : Voir, Modifier, Facturer
  - **Statistiques** : Voir, Exporter
  - **Utilisateurs admin** : Voir, Créer, Modifier, Supprimer

**Gestion des utilisateurs administrateurs :**
- Liste des comptes admin
- Tableau avec :
  - Nom, Prénom
  - Email
  - Rôle
  - Date de création
  - Dernière connexion
  - Statut (Actif, Suspendu)
  - Actions
- Création de nouveau compte admin :
  - Infos personnelles
  - Attribution de rôle
  - Génération mot de passe temporaire
  - Envoi email d'invitation
- Modification de rôle
- Suspension/Réactivation de compte
- Historique des actions par utilisateur (audit log)

### 10. Système de Notation Interne
**Scoring des candidats :**

**Critères de notation (sur 10) :**
- **Fiabilité** :
  - Basée sur : respect des engagements, feedbacks entreprises, assiduité
  - Saisie manuelle par admin
  - Historique des scores
- **Motivation** :
  - Basée sur : proactivité, réactivité, qualité des candidatures
  - Saisie manuelle
- **Compétences techniques** :
  - Auto-calculée selon : diplômes, expériences, certifications
  - Ajustable manuellement
- **Langues** :
  - Auto-calculée selon niveaux déclarés
  - Vérifiable par tests
- **Présentation** :
  - Qualité du profil, CV, photo
  - Évaluation admin

**Score global :**
- Moyenne pondérée des critères
- Affichage en étoiles (1-5) ou note (/10)
- Badge de qualité (Bronze, Argent, Or, Platine)
- Classement général des candidats

**Utilisation des scores :**
- Filtrage dans recherches
- Recommandations automatiques aux entreprises
- Mise en avant de profils
- Critère de sélection pour offres premium

**Gestion des scores :**
- Interface de notation par candidat
- Historique des modifications
- Justification obligatoire pour changements
- Export des scores

## DESIGN ET EXPÉRIENCE UTILISATEUR

### Charte graphique :
**Palette de couleurs :**
- Primaire : Bleu professionnel (#2563eb)
- Secondaire : Vert succès (#10b981)
- Accent : Orange énergie (#f97316)
- Gris : (#64748b pour textes, #f1f5f9 pour fonds)
- Alertes : Rouge (#ef4444), Jaune (#fbbf24)

**Typographie :**
- Titres : Font-bold, text-2xl/3xl/4xl
- Corps : Font-normal, text-base
- Labels : Font-medium, text-sm
- Boutons : Font-semibold

### Navigation :
**Header fixe (sticky top) avec :**
- Logo à gauche (cliquable vers home)
- Menu horizontal centre :
  - Accueil
  - Candidat (dropdown : Inscription, Connexion, Offres)
  - Entreprise (dropdown : Services, Demande d'accès, Connexion)
  - Contact
- Droite :
  - Sélecteur langue (drapeaux FR/GB/MG avec dropdown)
  - Icône notifications (badge compteur si connecté)
  - Avatar utilisateur (dropdown : Profil, Paramètres, Déconnexion)
- Version mobile : Menu burger avec sidebar

**Sidebar (pour dashboards admin et espaces connectés) :**
- Navigation verticale avec icônes + labels
- Sections repliables/dépliables
- Badge de notifications sur certains items
- Recherche rapide intégrée

**Breadcrumb :**
- Fil d'Ariane sur toutes les pages internes
- Format : Home > Section > Sous-section > Page actuelle

### Composants réutilisables :
**Cards :**
- Shadow, rounded, padding cohérents
- Hover effects (scale, shadow)

**Boutons :**
- Primaire : bg-blue-600 hover:bg-blue-700
- Secondaire : bg-gray-200 hover:bg-gray-300
- Succès : bg-green-600
- Danger : bg-red-600
- Disabled : opacity-50 cursor-not-allowed

**Forms :**
- Labels clairs au-dessus des champs
- Validation en temps réel
- Messages d'erreur sous les champs en rouge
- Champs requis avec astérisque
- Placeholder informatifs

**Modals :**
- Overlay semi-transparent
- Centré avec animation
- Close button (X en haut à droite)
- Actions en bas (Annuler/Confirmer)

**Tables :**
- Responsive (scroll horizontal sur mobile)
- Striped rows (alternance couleurs)
- Sortable columns (icônes flèches)
- Hover effect sur lignes
- Pagination en bas

**Badges/Tags :**
- Colorés selon contexte (statuts, catégories)
- Arrondis, petite taille
- Amovibles si nécessaire (icône X)

**Toasts/Notifications :**
- Position : top-right
- Auto-dismiss après 5s
- Types : success (vert), error (rouge), info (bleu), warning (jaune)
- Icône + message + close button

### Responsive design :
- **Desktop** (>1024px) : Layout complet, sidebar visible
- **Tablet** (768-1024px) : Sidebar repliable, grille ajustée
- **Mobile** (<768px) : Menu burger, colonnes empilées, bottom nav pour actions principales

### Animations et transitions :
- Transitions douces (duration-200/300)
- Hover effects sur éléments cliquables
- Loading spinners pendant chargements
- Skeleton screens pour contenu en chargement
- Page transitions fluides

## FONCTIONNALITÉS TRANSVERSES

### 1. Système d'Upload de Fichiers
**Upload simulé avec :**
- Drag & drop zone
- Click to browse
- Affichage nom fichier + taille
- Barre de progression (animée)
- Validation :
  - Types autorisés (PDF, DOCX pour CV ; JPG, PNG pour images)
  - Taille max (5MB pour docs, 2MB pour images)
  - Messages d'erreur si non conforme
- Preview pour images (base64)
- Stockage dans localStorage/window.storage avec l'objet fichier

### 2. Système de Recherche Intelligent
**Pour toutes les pages de liste :**
- Barre de recherche avec icône loupe
- Recherche en temps réel (debounce 300ms)
- Recherche dans multiples champs (titre, description, tags, etc.)
- Highlight des résultats
- Nombre de résultats affiché
- Clear button (X)
- Suggestions/Autocomplete (si pertinent)

### 3. Système de Filtres Avancés
**Sidebar ou accordéon de filtres avec :**
- Filtres cumulatifs (AND logic)
- Compteur de résultats en temps réel
- Reset filters button
- Sauvegarde des filtres appliqués
- Filtres prédéfinis (presets)
- Application des filtres avec transition smooth

### 4. Export de Données
**Fonctionnalité d'export sur listes/tableaux :**
- Bouton "Exporter" avec dropdown :
  - Excel (.xlsx) - simulation avec génération CSV
  - PDF - simulation avec print styling
  - CSV
- Options d'export :
  - Sélection actuelle uniquement
  - Tous les résultats
  - Colonnes à inclure (checkboxes)
- Génération et téléchargement automatique
- Notification de succès

### 5. Pagination
**Sur toutes les listes :**
- Nombre d'éléments par page (10, 20, 50, 100)
- Navigation : Première, Précédente, Numéros, Suivante, Dernière
- Affichage : "Résultats 1-20 sur 156"
- Jump to page (input numéro)

### 6. Système de Notifications
**Notifications in-app :**
- Icône cloche dans header avec badge compteur
- Panneau déroulant (dropdown) :
  - Liste des 10 dernières notifications
  - Groupées par : Aujourd'hui, Hier, Plus ancien
  - Chaque notification :
    - Icône selon type
    - Titre court
    - Timestamp relatif ("Il y a 2h")
    - Lu/Non lu (fond différent)
    - Lien vers élément concerné
  - Actions : Marquer tout comme lu, Voir toutes
- Page "Toutes les notifications" :
  - Liste complète
  - Filtres par type
  - Recherche
  - Suppression groupée

**Notifications push simulées :**
- Email : console.log simulant envoi
- SMS : console.log avec numéro + message
- WhatsApp : console.log avec format WhatsApp

### 7. Système de Messagerie Interne (détails techniques)
**Structure de données message :**
```javascript
{
  id, expediteurId, expediteurNom, expediteurRole,
  destinataireId(s), destinataireNom(s),
  sujet, contenu, dateEnvoi, lu, important, archive,
  pieceJointe: {nom, type, url/base64},
  conversationId (pour threading),
  reponseA (ID message parent)
}
```

**Interface messagerie :**
- Layout à 3 colonnes (desktop) :
  - **Colonne 1** : Dossiers (Réception, Envoyés, Brouillons, Archivés, Corbeille)
  - **Colonne 2** : Liste des messages du dossier sélectionné
  - **Colonne 3** : Contenu du message sélectionné
- Liste messages :
  - Avatar expéditeur
  - Nom expéditeur
  - Sujet (bold si non lu)
  - Extrait du message
  - Timestamp
  - Icônes (important, pièce jointe)
  - Actions au survol (Archive, Supprimer, Marquer)
- Vue message :
  - Header : Expéditeur, destinataires, sujet, date
  - Corps du message (HTML supporté)
  - Pièces jointes avec preview/download
  - Actions : Répondre, Transférer, Supprimer, Archiver, Marquer important
- Composer :
  - Modal ou vue plein écran
  - Champs : À (autocomplete depuis utilisateurs), Sujet, Corps (éditeur riche)
  - Upload pièces jointes
  - Brouillon auto-save toutes les 30s
  - Envoyer / Enregistrer brouillon

### 8. Système de Permissions et Sécurité
**Gestion des sessions :**
- Token stocké dans localStorage
- Expiration après 24h d'inactivité
- Refresh token automatique
- Déconnexion automatique si token expiré

**Routes protégées :**
- Vérification du rôle avant accès
- Redirection vers login si non authentifié
- Redirection vers page d'erreur si permissions insuffisantes
- Breadcrumb et sidebar adaptés selon rôle

**Sécurité des données :**
- Pas d'affichage de mots de passe (type="password")
- Cryptage simulé des mots de passe (hash basique)
- Validation des entrées utilisateur (XSS prevention)
- Confirmation avant suppressions
- Audit log (historique des actions sensibles)

## PAGES PUBLIQUES (NON CONNECTÉES)

### 1. Page d'Accueil
**Hero Section :**
- Grand titre accrocheur : "Votre passerelle vers l'emploi à Maurice"
- Sous-titre explicatif
- Image/Illustration de fond (travailleurs, Maurice)
- 2 CTA principaux :
  - "Je cherche un emploi" (vers inscription candidat)
  - "Je recrute" (vers demande accès entreprise)

**Section "Qui nous sommes" :**
- 3-4 paragraphes de présentation
- Mission, vision, valeurs
- Photo d'équipe

**Section "Nos Services" (3 colonnes) :**
- **Pour les candidats** :
  - Icône
  - Titre
  - Liste des services (inscription gratuite, offres vérifiées, accompagnement, etc.)
- **Pour les entreprises** :
  - Recrutement sur mesure
  - Base de CV qualifiés
  - Suivi personnalisé
- **Notre accompagnement** :
  - Présélection rigoureuse
  - Support administratif
  - Suivi post-recrutement

**Section "Nos Valeurs" (4 cartes) :**
- Éthique, Transparence, Professionnalisme, Engagement
- Chaque carte : icône + titre + description courte

**Section "Notre Équipe" (si pertinent) :**
- Photos en cercle
- Nom + Fonction
- Contact (email/LinkedIn)

**Section Chiffres Clés (4 compteurs animés) :**
- X candidats inscrits
- X offres publiées
- X placements réussis
- X entreprises partenaires

**Section Témoignages (carousel) :**
- 3-5 témoignages de candidats placés ou d'entreprises satisfaites
- Photo + Citation + Nom + Fonction/Entreprise

**Section CTA Final :**
- "Prêt à commencer ?"
- Boutons : Inscription candidat / Demande entreprise

**Footer :**
- Colonnes : À propos, Services, Liens utiles, Contact
- Réseaux sociaux
- Mentions légales / Politique de confidentialité
- Copyright

### 2. Page Candidat (non connecté)
**Présentation :**
- Titre : "Trouvez votre emploi à Maurice"
- Avantages de l'inscription (liste à puces avec icônes)

**Formulaire d'inscription visible :**
- Champs principaux (voir section inscription)
- Bouton "S'inscrire gratuitement"

**Ou bouton "Déjà inscrit ? Connectez-vous"**

**Section "Comment ça marche ?" (4 étapes) :**
1. Inscrivez-vous gratuitement
2. Complétez votre profil
3. Postulez aux offres
4. Décrochez votre emploi

**Liste des offres récentes (aperçu) :**
- 6 dernières offres en grille
- Bouton "Voir toutes les offres" → page offres publiques

### 3. Page Entreprise (non connecté)
**Présentation services :**
- Titre : "Recrutez les meilleurs talents malgaches"
- Description détaillée des services

**Avantages de la plateforme (cartes) :**
- Base de CV qualifiés
- Présélection rigoureuse
- Support administratif complet
- Suivi post-recrutement

**Processus de recrutement (timeline visuelle) :**
1. Demande d'accès
2. Validation sous 48h
3. Définition des besoins
4. Proposition de profils
5. Entretiens
6. Finalisation

**Formulaire de demande d'accès :**
- Visible directement sur la page
- Ou bouton "Demander un accès" → modal/page dédiée

**Secteurs couverts (badges) :**
- Liste des secteurs avec icônes

**Témoignages entreprises**

**CTA : "Commencez à recruter"**

### 4. Page Offres Publiques
**Liste de toutes les offres actives :**
- Accessible sans connexion (consultation uniquement)
- Filtres de recherche visibles
- Affichage en grille de cartes
- Clic sur offre → page détail offre

**Détail offre :**
- Toutes les informations de l'offre
- **Si non connecté** : Bouton "Postuler" → redirection vers login/inscription
- **Si connecté** : Bouton "Postuler" fonctionnel

### 5. Page Contact
**Informations de contact :**
- Adresse physique (avec mini carte Google Maps simulée)
- Email
- Téléphone
- Réseaux sociaux

**Formulaire de contact :**
- Nom, Prénom
- Email
- Téléphone (optionnel)
- Objet (dropdown : Candidat, Entreprise, Autre)
- Message (textarea)
- Upload document (optionnel)
- Checkbox RGPD : "J'accepte que mes données soient traitées"
- Bouton "Envoyer"

**Simulation d'envoi avec notification de succès**

## DONNÉES DE DÉMONSTRATION

### Créer un jeu de données réaliste comprenant :

**Candidats (au moins 50) :**
- Variété de profils :
  - Secteurs : Construction (15), Hôtellerie (10), Agriculture (8), Manufacture (7), Logistique (5), Nettoyage (3), Sécurité (2)
  - Âges : 20-50 ans
  - Sexe : ~60% H, ~40% F
  - Localisations à Madagascar : Antananarivo, Toamasina, Mahajanga, Antsirabe, Fianarantsoa
  - Niveaux : Sans diplôme (20%), CAP/BEP (30%), BAC (35%), BAC+ (15%)
  - Expériences : 0-15 ans
  - Langues : Malgache (tous), Français (80%, niveaux variés), Anglais (40%), Autres (10%)
  - Disponibilités variées
  - Certains avec CV vidéo, d'autres non
  - Scores de notation variés

**Entreprises (au moins 10) :**
- Variété de secteurs à Maurice
- Abonnements différents (Basique, Standard, Premium)
- Certaines avec recrutements en cours, d'autres terminés
- Dates de début/fin variées

**Offres d'emploi (au moins 30) :**
- Répartition sur tous les secteurs
- Statuts variés : Active (20), Expirée (5), Pourvue (5)
- Localisations variées à Maurice
- Différents types de contrats
- Fourchettes salariales réalistes
- Dates de publication échelonnées

**Candidatures (au moins 100) :**
- Répartition réaliste sur les offres
- Tous les statuts représentés
- Historique de changements de statut

**Messages (au moins 50) :**
- Conversations entre admin et candidats
- Conversations entre admin et entreprises
- Certains lus, d'autres non
- Avec et sans pièces jointes

**Notifications (au moins 30 par type d'utilisateur) :**
- Variété de types
- Récentes et plus anciennes
- Lues et non lues

## STOCKAGE DES DONNÉES

**Utiliser window.storage pour la persistance :**

**Clés de stockage :**
- `users` : Tableau de tous les utilisateurs
- `offres` : Tableau de toutes les offres
- `candidatures` : Tableau de toutes les candidatures
- `messages` : Tableau de tous les messages
- `notifications` : Tableau de toutes les notifications
- `demandes-entreprises` : Demandes d'accès en attente
- `contrats` : Contrats et abonnements
- `currentUser` : Utilisateur actuellement connecté
- `currentLang` : Langue sélectionnée

**Fonctions utilitaires pour le storage :**
```javascript
// Exemple de structure
const StorageService = {
  async getUsers() { ... },
  async saveUser(user) { ... },
  async updateUser(id, updates) { ... },
  async deleteUser(id) { ... },
  // Idem pour offres, candidatures, etc.
}
```

## FONCTIONNALITÉS BONUS (SI POSSIBLE)

1. **Mode sombre** : Toggle dans paramètres utilisateur
2. **Impression** : Version print-friendly des CV, offres, rapports
3. **Partage social** : Boutons de partage d'offres sur réseaux sociaux (simulation)
4. **Chatbot** : Widget de chat pour support (réponses prédéfinies)
5. **Comparaison de profils** : Sélection de plusieurs candidats pour comparaison côte à côte
6. **Calendrier intégré** : Vue calendrier pour les entretiens
7. **Graphiques interactifs** : Tooltips, zooms sur les statistiques
8. **Tutorial/Onboarding** : Guide pas à pas pour nouveaux utilisateurs (tour guidé)
9. **Feedback** : Système de notation de la plateforme par les utilisateurs
10. **Blog/Actualités** : Section avec articles sur l'emploi, conseils CV, etc.

## INSTRUCTIONS FINALES DE DÉVELOPPEMENT

1. **Architecture du code :**
   - Composants React modulaires et réutilisables
   - Custom hooks pour logique partagée (useAuth, useStorage, useTranslation)
   - Context providers pour état global
   - Dossiers organisés : /components, /pages, /contexts, /utils, /data

2. **Gestion d'état :**
   - Context API pour authentification, langue, données globales
   - useState/useReducer pour états locaux
   - useEffect pour chargements et side effects

3. **Routing :**
   - React Router avec routes imbriquées
   - Routes protégées avec composant ProtectedRoute
   - Routes publiques vs privées
   - 404 pour pages inexistantes

4. **Performance :**
   - Lazy loading des composants lourds
   - Memoization (useMemo, useCallback) pour calculs coûteux
   - Pagination pour grandes listes
   - Debounce pour recherches

5. **Accessibilité :**
   - Labels sur tous les form inputs
   - Alt text sur images
   - Navigation au clavier possible
   - Contraste suffisant

6. **Responsive :**
   - Mobile-first approach
   - Breakpoints Tailwind (sm, md, lg, xl)
   - Adaptation des layouts
   - Touch-friendly sur mobile

7. **Validation :**
   - Validation côté client pour tous les formulaires
   - Messages d'erreur explicites
   - Vérification des types de fichiers
   - Limites de taille

8. **UX :**
   - Loading states (spinners, skeletons)
   - Empty states (illustrations + messages)
   - Error states (messages + actions)
   - Confirmations avant actions destructives
   - Feedback immédiat (toasts, notifications)

9. **Code quality :**
   - Commentaires pour logique complexe
   - Nommage explicite des variables/fonctions
   - DRY (Don't Repeat Yourself)
   - Code lisible et maintenable

10. **Testing :**
    - Tester toutes les fonctionnalités principales
    - Vérifier les flows utilisateurs complets
    - Tester responsive sur différentes tailles
    - Vérifier les traductions

**Le prototype doit être entièrement fonctionnel, avec navigation fluide entre toutes les pages, persistance des données, et simulation réaliste de toutes les fonctionnalités décrites. Prioriser une expérience utilisateur intuitive et professionnelle.**