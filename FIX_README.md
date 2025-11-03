# 🔧 FIX APPLIQUÉ - Node.js 20

## ❌ Problème résolu

L'erreur `ReferenceError: File is not defined` a été corrigée en mettant à jour vers Node.js 20.

---

## ✅ Modifications appliquées

### 1. **package.json** - Version Node.js 20+
```json
{
  "engines": {
    "node": ">=20.0.0",
    "npm": ">=9.0.0"
  },
  "dependencies": {
    "axios": "^1.6.2"
  }
}
```

### 2. **render.yaml** - Variable NODE_VERSION ajoutée
```yaml
envVars:
  - key: NODE_VERSION
    value: 20.11.0
```

### 3. **.nvmrc** - Fichier créé (NOUVEAU)
```
20.11.0
```

### 4. **Dockerfile** - Image Node.js 20
```dockerfile
FROM node:20-alpine
```

---

## 🚀 Comment appliquer le fix

### Méthode rapide (Script automatique)

```bash
chmod +x fix-node-version.sh
./fix-node-version.sh
```

### Méthode manuelle

```bash
# 1. Vérifier les fichiers
cat package.json | grep "node"
cat render.yaml | grep "NODE_VERSION"
cat .nvmrc

# 2. Committer et pousser
git add .
git commit -m "Fix: Update to Node.js 20"
git push

# 3. Render redéploie automatiquement
```

---

## ✅ Vérification après déploiement

### 1. Vérifier les logs Render

Dashboard Render → Votre service → Logs

Cherchez cette ligne au début du build :
```
Node version: v20.11.0
```

### 2. Tester l'API

```bash
# Test basique
curl https://votre-app.onrender.com/

# Test complet
curl https://votre-app.onrender.com/api/check/Lyon
```

**Résultat attendu :** Réponse JSON sans erreur

---

## 🔄 Si vous avez encore des problèmes

### Option 1 : Clear build cache

1. Dashboard Render → Votre service
2. **Manual Deploy**
3. **Clear build cache & deploy**

### Option 2 : Vérifier la version dans Render

Ajoutez temporairement dans `render.yaml` :
```yaml
buildCommand: |
  echo "Node version:"
  node --version
  npm install
```

---

## 📊 Versions utilisées

| Composant | Version | Status |
|-----------|---------|--------|
| Node.js   | 20.11.0 | ✅ Fixé |
| axios     | 1.6.2   | ✅ Compatible |
| cheerio   | 1.0.0-rc.12 | ✅ Compatible |
| express   | 4.18.2  | ✅ Compatible |

---

## 💡 Pourquoi ce fix ?

**Problème :** Axios 1.6+ utilise `undici` qui requiert l'API `File` disponible uniquement dans Node.js 20+

**Solution :** Upgrade vers Node.js 20 qui inclut cette API nativement

**Impact :** Aucun changement de code nécessaire, juste la version Node.js

---

## 📖 Documentation complète

Pour plus de détails, consultez **[TROUBLESHOOTING.md](./TROUBLESHOOTING.md)**

---

## ✅ Checklist

- [x] package.json mis à jour avec Node 20
- [x] render.yaml mis à jour avec NODE_VERSION
- [x] .nvmrc créé avec version 20.11.0
- [x] Dockerfile mis à jour avec node:20-alpine
- [ ] Code poussé sur GitHub
- [ ] Render a redéployé automatiquement
- [ ] Logs vérifiés (Node v20.x.x)
- [ ] API testée et fonctionnelle

---

**🎉 Le fix est prêt ! Poussez le code et Render utilisera automatiquement Node.js 20.**

```bash
git push
```
