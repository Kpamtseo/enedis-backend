# 🚀 Guide de Déploiement sur Render

Ce guide vous explique comment déployer votre backend API Enedis sur Render.com (hébergement gratuit).

---

## 📋 Prérequis

1. Compte GitHub (pour héberger le code)
2. Compte Render.com (inscription gratuite sur https://render.com)

---

## 🎯 Méthode 1 : Déploiement automatique avec render.yaml (Recommandé)

### Étape 1 : Préparer votre dépôt Git

```bash
# Initialiser Git (si ce n'est pas déjà fait)
git init

# Ajouter tous les fichiers
git add .

# Créer le commit initial
git commit -m "Initial commit - Enedis API"

# Créer un dépôt sur GitHub et le lier
git remote add origin https://github.com/VOTRE_USERNAME/enedis-api.git
git branch -M main
git push -u origin main
```

### Étape 2 : Se connecter à Render

1. Allez sur https://render.com
2. Cliquez sur **"Sign Up"** ou **"Sign In"**
3. Connectez-vous avec votre compte GitHub

### Étape 3 : Créer le service

1. Depuis le Dashboard Render, cliquez sur **"New +"**
2. Sélectionnez **"Blueprint"**
3. Connectez votre dépôt GitHub
4. Render détectera automatiquement le fichier `render.yaml`
5. Cliquez sur **"Apply"**

### Étape 4 : Attendre le déploiement

- Le build prend environ 2-3 minutes
- Vous verrez les logs en temps réel
- Une fois terminé, votre API sera accessible à : `https://enedis-api.onrender.com`

---

## 🎯 Méthode 2 : Déploiement manuel (Alternative)

### Étape 1 : Créer un Web Service

1. Dashboard Render → **"New +"** → **"Web Service"**
2. Connectez votre dépôt GitHub
3. Configurez :

```
Name: enedis-api
Region: Frankfurt (ou Oregon, Singapore)
Branch: main
Runtime: Node
Build Command: npm install
Start Command: npm start
Plan: Free
```

### Étape 2 : Variables d'environnement

Ajoutez dans la section "Environment" :

```
NODE_ENV = production
PORT = 10000
CORS_ORIGINS = *
```

### Étape 3 : Déployer

Cliquez sur **"Create Web Service"**

---

## ✅ Vérification du déploiement

### Test 1 : API Status
```bash
curl https://votre-app.onrender.com/
```

Réponse attendue :
```json
{
  "status": "ok",
  "message": "API Enedis Coupure - Backend opérationnel"
}
```

### Test 2 : Vérifier une ville
```bash
curl https://votre-app.onrender.com/api/check/Lyon
```

---

## 🔧 Configuration avancée

### Fichier render.yaml complet

Le fichier `render.yaml` à la racine de votre projet contient toute la configuration :

```yaml
services:
  - type: web
    name: enedis-api
    runtime: node
    env: node
    region: frankfurt
    plan: free
    buildCommand: npm install
    startCommand: npm start
    healthCheckPath: /
    envVars:
      - key: NODE_ENV
        value: production
      - key: PORT
        value: 10000
      - key: CORS_ORIGINS
        value: "*"
    autoDeploy: true
```

### Options disponibles

**Regions** :
- `frankfurt` (Europe)
- `oregon` (US West)
- `ohio` (US East)
- `singapore` (Asia)

**Plans** :
- `free` - Gratuit (service s'endort après 15 min d'inactivité)
- `starter` - $7/mois (toujours actif)
- `standard` - $25/mois
- `pro` - $85/mois

---

## 🌐 Utiliser l'API déployée

### Depuis votre frontend

Modifiez l'URL de l'API dans votre fichier `public/index.html` :

```javascript
// Avant (local)
const API_URL = 'http://localhost:3000';

// Après (Render)
const API_URL = 'https://votre-app.onrender.com';
```

### Déployer aussi le frontend

Vous pouvez déployer le frontend sur :
- **Render** (Static Site)
- **Netlify**
- **Vercel**
- **GitHub Pages**

---

## 🔒 Configuration CORS pour production

### Option 1 : Autoriser un domaine spécifique

Dans Render, modifiez la variable d'environnement :

```
CORS_ORIGINS = https://votre-frontend.netlify.app
```

### Option 2 : Autoriser plusieurs domaines

```
CORS_ORIGINS = https://site1.com,https://site2.com
```

### Option 3 : Modifier le code server.js

```javascript
app.use(cors({
  origin: process.env.CORS_ORIGINS?.split(',') || '*',
  methods: ['GET', 'POST'],
  credentials: true
}));
```

---

## 📊 Monitoring et Logs

### Voir les logs en temps réel

1. Dashboard Render → Votre service
2. Onglet **"Logs"**
3. Les logs s'affichent en temps réel

### Métriques

1. Onglet **"Metrics"** pour voir :
   - CPU usage
   - Memory usage
   - Request count
   - Response times

### Alertes

1. Onglet **"Notifications"**
2. Configurez des alertes par email

---

## 🔄 Mises à jour automatiques

Avec `autoDeploy: true` dans `render.yaml`, chaque push sur la branche `main` déclenchera automatiquement un nouveau déploiement.

```bash
# Faire des modifications
git add .
git commit -m "Update API"
git push

# Render redéploie automatiquement !
```

---

## ⚡ Optimisations

### 1. Éviter le "cold start"

Sur le plan gratuit, le service s'endort après 15 min d'inactivité. Pour le "réveiller" :

**Option A** : Utiliser un service de ping
- https://uptimerobot.com (gratuit)
- Pingue votre API toutes les 5 minutes

**Option B** : Passer au plan Starter ($7/mois)

### 2. Variables d'environnement sensibles

Pour les clés API ou secrets :

1. Dashboard → Votre service → **"Environment"**
2. Ajoutez vos variables
3. Ne les commitez JAMAIS dans Git

### 3. Cache des dépendances

Render cache automatiquement `node_modules` pour accélérer les builds.

---

## 🐛 Dépannage

### Erreur : "Build failed"

**Vérifiez** :
- `package.json` est présent
- Les dépendances sont correctes
- Node version compatible (voir logs)

**Solution** : Spécifier la version Node dans `package.json` :

```json
{
  "engines": {
    "node": ">=18.0.0"
  }
}
```

### Erreur : "Application failed to respond"

**Vérifiez** :
- Le port utilisé est bien celui fourni par Render (`process.env.PORT`)
- Le serveur démarre correctement (voir logs)

**Solution** : Dans `server.js`, utilisez :

```javascript
const PORT = process.env.PORT || 3000;
```

### Service s'endort (plan gratuit)

**Solutions** :
1. Utiliser UptimeRobot pour pinguer l'API
2. Passer au plan Starter
3. Accepter le délai de démarrage (10-30 secondes)

### Erreur CORS

**Vérifiez** :
- La variable `CORS_ORIGINS` est correctement configurée
- Votre frontend utilise la bonne URL

---

## 📱 Déployer le frontend sur Render

### Étape 1 : Créer un Static Site

1. Dashboard → **"New +"** → **"Static Site"**
2. Connectez votre dépôt
3. Configurez :

```
Name: enedis-frontend
Branch: main
Build Command: (laisser vide)
Publish Directory: public
```

### Étape 2 : Modifier l'URL de l'API

Dans `public/index.html`, changez :

```javascript
const API_URL = 'https://enedis-api.onrender.com';
```

---

## 💰 Coûts

### Plan Gratuit
- ✅ Parfait pour développement/test
- ✅ Bande passante : 100 GB/mois
- ✅ Build minutes : 500/mois
- ⚠️ Service s'endort après 15 min

### Plan Starter ($7/mois)
- ✅ Toujours actif
- ✅ Performances améliorées
- ✅ Support prioritaire

---

## 🔗 URLs et Domaines personnalisés

### URL par défaut
```
https://votre-app.onrender.com
```

### Ajouter un domaine personnalisé (gratuit)

1. Onglet **"Settings"**
2. Section **"Custom Domains"**
3. Ajoutez votre domaine
4. Configurez les DNS chez votre registrar

---

## 📋 Checklist de déploiement

- [ ] Code pushé sur GitHub
- [ ] `render.yaml` présent à la racine
- [ ] Variables d'environnement configurées
- [ ] Service créé sur Render
- [ ] Build réussi
- [ ] Health check OK
- [ ] Tests API effectués
- [ ] CORS configuré pour production
- [ ] Frontend mis à jour avec nouvelle URL
- [ ] Monitoring configuré (optionnel)

---

## 🎯 Commandes utiles

### Logs en temps réel
```bash
# Installer le CLI Render (optionnel)
npm install -g @render/cli

# Voir les logs
render logs
```

### Redéployer manuellement
1. Dashboard → Votre service
2. **"Manual Deploy"** → **"Deploy latest commit"**

---

## 📞 Support

### Documentation Render
- https://render.com/docs

### Status Render
- https://status.render.com

### Community
- https://community.render.com

---

## 🚀 Résumé du déploiement

```bash
# 1. Préparer le projet
git init
git add .
git commit -m "Initial commit"

# 2. Pusher sur GitHub
git remote add origin https://github.com/USERNAME/enedis-api.git
git push -u origin main

# 3. Sur Render.com
# - Créer un Blueprint avec le fichier render.yaml
# - Ou créer un Web Service manuellement

# 4. Tester
curl https://votre-app.onrender.com/api/check/Lyon

# 5. Mettre à jour le frontend
# Remplacer localhost:3000 par votre-app.onrender.com
```

---

## ✨ Bonus : GitHub Actions pour CI/CD

Créez `.github/workflows/deploy.yml` :

```yaml
name: Deploy to Render

on:
  push:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    - name: Install dependencies
      run: npm install
    - name: Run tests
      run: npm test
```

---

**🎉 Votre API est maintenant déployée sur Render et accessible depuis n'importe où !**

URL de test : `https://votre-app.onrender.com`
