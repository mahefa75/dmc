# Guide de déploiement sur Netlify

Ce guide vous explique comment déployer votre application sur Netlify et configurer les variables d'environnement Firebase.

## 🚀 Déploiement sur Netlify

### Méthode 1 : Déploiement via l'interface Netlify (Recommandé)

1. **Préparer votre projet**
   - Assurez-vous que votre code est poussé sur GitHub, GitLab ou Bitbucket
   - Vérifiez que le fichier `netlify.toml` est présent à la racine du projet

2. **Créer un compte Netlify**
   - Allez sur https://www.netlify.com/
   - Créez un compte ou connectez-vous

3. **Connecter votre dépôt**
   - Dans le dashboard Netlify, cliquez sur "Add new site" → "Import an existing project"
   - Sélectionnez votre fournisseur Git (GitHub, GitLab, etc.)
   - Autorisez Netlify à accéder à votre dépôt
   - Sélectionnez le dépôt contenant votre projet

4. **Configurer les paramètres de build**
   - **Build command** : `npm run build` (déjà configuré dans `netlify.toml`)
   - **Publish directory** : `dist` (déjà configuré dans `netlify.toml`)
   - Netlify détectera automatiquement ces paramètres depuis `netlify.toml`

5. **Configurer les variables d'environnement Firebase**
   - Avant de déployer, allez dans **Site settings** → **Environment variables**
   - Ajoutez les variables suivantes avec vos valeurs Firebase :

```
VITE_FIREBASE_API_KEY=votre-api-key
VITE_FIREBASE_AUTH_DOMAIN=votre-projet.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=votre-project-id
VITE_FIREBASE_STORAGE_BUCKET=votre-projet.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=votre-app-id
```

   - Cliquez sur "Save" pour chaque variable

6. **Déployer**
   - Cliquez sur "Deploy site"
   - Netlify va automatiquement :
     - Installer les dépendances (`npm install`)
     - Exécuter le build (`npm run build`)
     - Déployer le dossier `dist`

### Méthode 2 : Déploiement via Netlify CLI

1. **Installer Netlify CLI**
   ```bash
   npm install -g netlify-cli
   ```

2. **Se connecter à Netlify**
   ```bash
   netlify login
   ```

3. **Initialiser le site**
   ```bash
   netlify init
   ```
   - Suivez les instructions pour créer un nouveau site ou lier un site existant

4. **Configurer les variables d'environnement**
   ```bash
   netlify env:set VITE_FIREBASE_API_KEY "votre-api-key"
   netlify env:set VITE_FIREBASE_AUTH_DOMAIN "votre-projet.firebaseapp.com"
   netlify env:set VITE_FIREBASE_PROJECT_ID "votre-project-id"
   netlify env:set VITE_FIREBASE_STORAGE_BUCKET "votre-projet.appspot.com"
   netlify env:set VITE_FIREBASE_MESSAGING_SENDER_ID "123456789"
   netlify env:set VITE_FIREBASE_APP_ID "votre-app-id"
   ```

5. **Déployer**
   ```bash
   netlify deploy --prod
   ```

## 🔧 Configuration des variables d'environnement Firebase

### Où trouver vos credentials Firebase ?

1. Allez sur https://console.firebase.google.com/
2. Sélectionnez votre projet
3. Cliquez sur l'icône ⚙️ (Paramètres du projet)
4. Faites défiler jusqu'à "Vos applications"
5. Si vous n'avez pas encore d'application web, cliquez sur l'icône `</>` pour en ajouter une
6. Copiez les valeurs de configuration qui ressemblent à ceci :

```javascript
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "votre-projet.firebaseapp.com",
  projectId: "votre-project-id",
  storageBucket: "votre-projet.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
}
```

### Variables d'environnement à configurer sur Netlify

Dans le dashboard Netlify, allez dans :
**Site settings** → **Environment variables** → **Add a variable**

Ajoutez ces 6 variables :

| Variable | Description | Exemple |
|----------|-------------|---------|
| `VITE_FIREBASE_API_KEY` | Clé API Firebase | `AIzaSy...` |
| `VITE_FIREBASE_AUTH_DOMAIN` | Domaine d'authentification | `mon-projet.firebaseapp.com` |
| `VITE_FIREBASE_PROJECT_ID` | ID du projet Firebase | `mon-projet-id` |
| `VITE_FIREBASE_STORAGE_BUCKET` | Bucket de stockage | `mon-projet.appspot.com` |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | ID de l'expéditeur | `123456789` |
| `VITE_FIREBASE_APP_ID` | ID de l'application | `1:123456789:web:abc...` |

⚠️ **Important** : Les variables doivent commencer par `VITE_` pour être accessibles dans votre code Vite.

### Variables d'environnement par environnement

Netlify permet de définir des variables différentes pour :
- **Production** : Variables utilisées lors des déploiements en production
- **Deploy previews** : Variables pour les previews de pull requests
- **Branch deploys** : Variables pour les déploiements de branches spécifiques

Vous pouvez configurer des valeurs différentes pour chaque environnement si nécessaire.

## 🔍 Vérification après déploiement

1. **Vérifier que le site est accessible**
   - Netlify vous donnera une URL du type `https://votre-site.netlify.app`
   - Ouvrez cette URL dans votre navigateur

2. **Vérifier la console du navigateur**
   - Ouvrez les outils de développement (F12)
   - Allez dans l'onglet "Console"
   - Vérifiez qu'il n'y a pas d'erreurs liées à Firebase ou aux modules

3. **Tester l'authentification**
   - Essayez de vous connecter
   - Vérifiez que Firebase se connecte correctement

## 🐛 Résolution des problèmes

### Erreur MIME type "application/octet-stream"

Cette erreur est résolue par le fichier `netlify.toml` qui configure les bons headers MIME pour les fichiers JavaScript.

Si l'erreur persiste :
1. Vérifiez que `netlify.toml` est bien à la racine du projet
2. Redéployez le site
3. Videz le cache de votre navigateur (Ctrl+Shift+R ou Cmd+Shift+R)

### Variables d'environnement non chargées

1. Vérifiez que les variables commencent bien par `VITE_`
2. Vérifiez que les variables sont bien définies dans Netlify
3. Redéployez le site après avoir ajouté/modifié les variables
4. Les variables d'environnement sont injectées au moment du build, pas au runtime

### Le site ne se charge pas / erreur 404

1. Vérifiez que le dossier de build est bien `dist`
2. Vérifiez que la redirection SPA est bien configurée dans `netlify.toml`
3. Vérifiez les logs de build dans Netlify pour voir s'il y a des erreurs

### Firebase ne fonctionne pas

1. Vérifiez que toutes les variables d'environnement sont bien configurées
2. Vérifiez que les règles de sécurité Firestore autorisent les opérations nécessaires
3. Vérifiez que Firebase Authentication est bien activé dans la console Firebase
4. Vérifiez la console du navigateur pour les erreurs spécifiques

## 📝 Notes importantes

- **Sécurité** : Ne commitez jamais vos fichiers `.env` contenant vos vraies credentials
- **Cache** : Netlify met en cache les assets. Si vous modifiez des fichiers, vous devrez peut-être vider le cache
- **Build time** : Les variables d'environnement sont injectées au moment du build, pas au runtime
- **Redéploiement** : Après avoir modifié les variables d'environnement, vous devez redéployer le site

## 🔗 Ressources utiles

- [Documentation Netlify](https://docs.netlify.com/)
- [Documentation Vite - Variables d'environnement](https://vitejs.dev/guide/env-and-mode.html)
- [Documentation Firebase](https://firebase.google.com/docs)



