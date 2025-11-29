# Configuration Firebase

Ce projet utilise Firebase pour le stockage des données et l'authentification.

## Étapes de configuration

1. **Créer un projet Firebase**
   - Allez sur https://console.firebase.google.com/
   - Cliquez sur "Ajouter un projet"
   - Suivez les étapes pour créer votre projet

2. **Activer Firestore Database**
   - Dans la console Firebase, allez dans "Firestore Database"
   - Cliquez sur "Créer une base de données"
   - Choisissez le mode "Production" ou "Test" (pour le développement)
   - Sélectionnez une région pour votre base de données

3. **Activer Firebase Authentication**
   - Dans la console Firebase, allez dans "Authentication"
   - Cliquez sur "Commencer"
   - Activez la méthode "Email/Password" dans l'onglet "Sign-in method"

4. **Récupérer les credentials**
   - Dans la console Firebase, allez dans "Paramètres du projet" (icône d'engrenage)
   - Faites défiler jusqu'à "Vos applications"
   - Cliquez sur l'icône Web (</>) pour ajouter une application web
   - Copiez les valeurs de configuration

5. **Configurer les variables d'environnement**
   - Créez un fichier `.env` à la racine du projet
   - Ajoutez les variables suivantes avec vos valeurs :

```env
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=your-app-id
```

6. **Règles de sécurité Firestore**

Pour le développement, vous pouvez utiliser ces règles temporaires (à modifier pour la production) :

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

**⚠️ Attention** : Ces règles permettent à tous les utilisateurs authentifiés de lire et écrire toutes les données. Pour la production, vous devrez créer des règles plus restrictives basées sur les rôles des utilisateurs.

## Collections Firestore

Le projet utilise les collections suivantes :
- `users` - Utilisateurs (candidats, entreprises, admins)
- `offres` - Offres d'emploi
- `candidatures` - Candidatures
- `messages` - Messages entre utilisateurs
- `notifications` - Notifications
- `demandesEntreprises` - Demandes d'accès des entreprises
- `contrats` - Contrats

## Migration depuis localStorage

### Migration automatique

L'application détecte automatiquement les données existantes dans localStorage et propose de les migrer vers Firebase lors du premier démarrage. Si des données sont détectées, elles seront automatiquement migrées.

### Migration manuelle

Si vous souhaitez migrer manuellement les données :

1. **Via le Dashboard Admin** :
   - Connectez-vous en tant qu'administrateur
   - Allez sur le Dashboard Admin
   - Si des données sont détectées dans localStorage, une alerte apparaîtra
   - Cliquez sur "Migrer maintenant" pour lancer la migration
   - Après migration réussie, vous pouvez nettoyer le localStorage

2. **Via la console du navigateur** :
   ```javascript
   // Vérifier les données disponibles
   window.checkLocalStorageData()
   
   // Lancer la migration
   await window.migrateToFirebase()
   
   // Nettoyer le localStorage après migration (optionnel)
   window.clearLocalStorageAfterMigration()
   ```

### Processus de migration

La migration :
- ✅ Vérifie les doublons (par ID et email pour les utilisateurs)
- ✅ Ignore les données déjà présentes dans Firebase
- ✅ Migre toutes les collections : users, offres, candidatures, messages, notifications, demandesEntreprises, contrats
- ✅ Génère un rapport détaillé avec les statistiques
- ✅ Gère les erreurs sans interrompre le processus

### Après la migration

Une fois la migration terminée avec succès, vous pouvez :
- Conserver les données dans localStorage comme sauvegarde (recommandé temporairement)
- Nettoyer le localStorage pour libérer de l'espace (les données sont maintenant dans Firebase)

**⚠️ Important** : Le nettoyage du localStorage est irréversible. Assurez-vous que la migration s'est bien déroulée avant de nettoyer.

