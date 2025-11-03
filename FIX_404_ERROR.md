# 🔧 FIX - Erreur 404 sur /api/check/:city

## ❌ Problème identifié

```
Request failed with status code 404
npm error signal SIGTERM
```

**Cause :** La route `/api/check/:city` essayait d'appeler `http://localhost:3000` qui n'existe pas sur Render.

---

## ✅ Solution appliquée

### Modifications dans server.js

1. **Route /api/check/:city** - Ne fait plus d'appels localhost
   - Appelle directement l'API de géocodage
   - Gère les erreurs de manière non-bloquante

2. **Gestion des erreurs** - Améliorée
   - Logs détaillés pour le debug
   - Arrêt gracieux du serveur
   - Gestion des erreurs non capturées

3. **Binding sur 0.0.0.0** - Pour Render
   - Le serveur écoute sur toutes les interfaces

---

## 🚀 Comment appliquer le fix

### Méthode automatique

```bash
git add server.js
git commit -m "Fix: Erreur 404 sur /api/check/:city - Suppression appels localhost"
git push
```

Render redéploiera automatiquement en 2-3 minutes.

---

## 🧪 Tester après le fix

### Test 1 : Status API
```bash
curl https://enedis-backend-pdqw.onrender.com/
```

**Attendu :**
```json
{
  "status": "ok",
  "message": "API Enedis Coupure - Backend opérationnel"
}
```

### Test 2 : Géocodage
```bash
curl https://enedis-backend-pdqw.onrender.com/api/geocode/Lyon
```

**Attendu :** Données de géocodage de Lyon

### Test 3 : Vérification complète (celui qui plantait)
```bash
curl https://enedis-backend-pdqw.onrender.com/api/check/Lyon
```

**Attendu :** Données complètes avec géolocalisation et status de coupure

---

## 🔍 Vérifier les logs Render

Après le redéploiement :

1. Dashboard Render → votre service
2. Onglet **Logs**
3. Cherchez :
   ```
   🚀 Backend API Enedis - Démarré avec succès
   Node version: v20.11.0
   ```

4. Puis testez l'API et observez les logs :
   ```
   📍 Request: /api/check/Lyon
   🔍 Géocodage de Lyon...
   ✅ Géocodage réussi: Lyon
   🔍 Vérification des coupures pour Lyon...
   ✅ Vérification coupure réussie: ok
   ✅ Réponse envoyée pour Lyon
   ```

---

## 📊 Changements détaillés

### Avant (problématique)
```javascript
// ❌ Appelait localhost qui n'existe pas sur Render
const geoResponse = await axios.get(`http://localhost:${PORT}/api/geocode/${city}`);
const outageResponse = await axios.post(`http://localhost:${PORT}/api/outage`, {...});
```

### Après (corrigé)
```javascript
// ✅ Appelle directement l'API externe
const geoResponse = await axios.get(`${GEO_API_URL}`, {
    params: { nom: city, ... }
});

// ✅ Gère les coupures avec try/catch non-bloquant
try {
    const outageResponse = await axios.get(enedisURL, {...});
    outageInfo = extractOutageInfo($);
} catch (enedisError) {
    // Continue même si Enedis ne répond pas
    console.warn('Erreur Enedis (non bloquante)');
}
```

---

## 💡 Améliorations ajoutées

1. **Logs détaillés**
   - Chaque étape est loggée
   - Facilite le debugging

2. **Erreurs non-bloquantes**
   - Si Enedis ne répond pas, l'API répond quand même
   - Message d'erreur clair pour l'utilisateur

3. **Arrêt gracieux**
   - Gestion propre de SIGTERM/SIGINT
   - Fermeture propre des connexions

4. **Binding 0.0.0.0**
   - Nécessaire pour Render
   - Écoute sur toutes les interfaces réseau

---

## 🎯 Checklist

Après avoir pushé le fix :

- [ ] Code pushé sur GitHub
- [ ] Render a redéployé (voir Dashboard)
- [ ] Logs montrent "Démarré avec succès"
- [ ] Test 1 : Status API (OK)
- [ ] Test 2 : Géocodage (OK)
- [ ] Test 3 : /api/check/:city (OK - celui qui plantait)
- [ ] Pas d'erreur SIGTERM dans les logs
- [ ] Frontend fonctionne avec l'API

---

## 🔄 Si le problème persiste

### Option 1 : Clear build cache
```
Dashboard Render → Manual Deploy → Clear build cache & deploy
```

### Option 2 : Vérifier les variables d'environnement
```
Dashboard Render → Environment
PORT = 10000 (défini automatiquement)
NODE_ENV = production
```

### Option 3 : Voir les logs en détail
```
Dashboard Render → Logs → Chercher les erreurs
```

---

## 📝 Notes importantes

- ✅ Le fix est **rétrocompatible** - Fonctionne en local ET sur Render
- ✅ **Pas besoin** de modifier les autres fichiers
- ✅ Les tests locaux (`npm test`) fonctionnent toujours
- ✅ Docker continue de fonctionner

---

## 🎉 Résultat attendu

Après le fix, tous les endpoints doivent fonctionner :

```bash
# Tous ces appels doivent réussir
curl https://enedis-backend-pdqw.onrender.com/
curl https://enedis-backend-pdqw.onrender.com/api/geocode/Lyon
curl https://enedis-backend-pdqw.onrender.com/api/check/Lyon
curl https://enedis-backend-pdqw.onrender.com/api/departments
```

---

**🚀 Pushez le code maintenant et testez dans 3 minutes !**

```bash
git add server.js
git commit -m "Fix: Remove localhost calls for Render compatibility"
git push
```
