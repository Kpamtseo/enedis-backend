# 🚀 Déploiement Rapide sur Render

Guide simplifié pour déployer votre API Enedis sur Render en 5 minutes.

---

## ⚡ Méthode Express (Recommandée)

### 1. Script automatique

Exécutez le script de déploiement :

```bash
chmod +x deploy-render.sh
./deploy-render.sh
```

Le script va :
- ✅ Vérifier tous les fichiers
- ✅ Initialiser Git
- ✅ Créer le commit
- ✅ Pousser sur GitHub
- ✅ Afficher les instructions Render

### 2. Configuration sur Render

1. Allez sur **https://render.com**
2. Connectez-vous avec GitHub
3. **New +** → **Blueprint**
4. Sélectionnez votre dépôt
5. Cliquez sur **Apply**

✅ **C'est tout !** Votre API sera déployée en 2-3 minutes.

---

## 📝 Méthode Manuelle

### Étape 1 : Préparer Git

```bash
# Initialiser Git
git init
git add .
git commit -m "Deploy to Render"

# Créer un dépôt sur GitHub puis :
git remote add origin https://github.com/USERNAME/enedis-api.git
git push -u origin main
```

### Étape 2 : Créer le service sur Render

**Option A : Avec render.yaml (Auto)**
1. New + → Blueprint
2. Connectez votre repo
3. Apply

**Option B : Configuration manuelle**
1. New + → Web Service
2. Connectez votre repo
3. Configurez :
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free

### Étape 3 : Variables d'environnement

Ajoutez dans Environment :
```
NODE_ENV = production
PORT = 10000
CORS_ORIGINS = *
```

---

## 🌐 URL de votre API

Une fois déployé, votre API sera accessible à :

```
https://enedis-api.onrender.com
```

ou

```
https://VOTRE-NOM-APP.onrender.com
```

---

## ✅ Test de déploiement

```bash
# Test 1 : API status
curl https://votre-app.onrender.com/

# Test 2 : Géocoder une ville
curl https://votre-app.onrender.com/api/geocode/Lyon

# Test 3 : Vérifier une coupure
curl https://votre-app.onrender.com/api/check/Saint-Priest
```

---

## 🔄 Mises à jour

Chaque push sur `main` redéploie automatiquement :

```bash
git add .
git commit -m "Update"
git push
```

---

## 🔧 Configuration CORS

### Pour autoriser votre frontend

Dans Render, modifiez la variable :

```
CORS_ORIGINS = https://votre-frontend.com
```

### Pour plusieurs domaines

```
CORS_ORIGINS = https://site1.com,https://site2.com
```

---

## 📱 Utiliser l'API dans votre frontend

Modifiez `public/index.html` :

```javascript
// Remplacer
const API_URL = 'http://localhost:3000';

// Par
const API_URL = 'https://votre-app.onrender.com';
```

---

## 💡 Astuces

### Éviter le "cold start" (plan gratuit)

Le service gratuit s'endort après 15 min d'inactivité.

**Solutions** :
1. Utiliser [UptimeRobot](https://uptimerobot.com) (gratuit) pour pinguer l'API toutes les 5 minutes
2. Passer au plan Starter ($7/mois) pour service toujours actif

### Configuration UptimeRobot

1. Créez un compte sur https://uptimerobot.com
2. Add New Monitor
   - Type: HTTPS
   - URL: `https://votre-app.onrender.com/`
   - Interval: 5 minutes

---

## 🐛 Dépannage

### Build échoué

Vérifiez que `package.json` contient :

```json
{
  "engines": {
    "node": ">=18.0.0"
  },
  "scripts": {
    "start": "node server.js"
  }
}
```

### Service ne répond pas

Vérifiez dans les logs Render que le serveur démarre correctement.

### CORS error

Ajoutez votre domaine frontend dans `CORS_ORIGINS`.

---

## 📊 Monitoring

### Voir les logs

1. Dashboard Render → Votre service
2. Onglet **Logs**
3. Logs en temps réel

### Métriques

Onglet **Metrics** pour voir :
- CPU/Memory usage
- Nombre de requêtes
- Temps de réponse

---

## 💰 Tarifs

| Plan | Prix | Caractéristiques |
|------|------|------------------|
| **Free** | $0 | Service s'endort après 15 min, 100 GB/mois |
| **Starter** | $7/mois | Toujours actif, performances meilleures |
| **Standard** | $25/mois | Plus de ressources |

---

## 🎯 Checklist

- [ ] Code sur GitHub
- [ ] `render.yaml` présent
- [ ] Service créé sur Render
- [ ] Build réussi
- [ ] Tests API OK
- [ ] Frontend mis à jour avec nouvelle URL
- [ ] CORS configuré
- [ ] Monitoring configuré (optionnel)

---

## 📞 Liens utiles

- **Dashboard Render** : https://dashboard.render.com
- **Documentation** : https://render.com/docs
- **Status** : https://status.render.com
- **Support** : https://community.render.com

---

## 🎉 C'est terminé !

Votre API est maintenant en ligne et accessible depuis n'importe où dans le monde !

**URL de test** : https://votre-app.onrender.com/api/check/Lyon

---

**Besoin d'aide ?** Consultez le guide complet dans `RENDER_DEPLOYMENT.md`
