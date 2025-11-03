# 🔧 Guide de Dépannage - Erreur Node.js

## ❌ Erreur rencontrée

```
ReferenceError: File is not defined
    at Object.<anonymous> (/app/node_modules/undici/lib/web/webidl/index.js:531:48)
```

---

## 🎯 Cause du problème

Cette erreur se produit avec Node.js 18.x à cause d'un conflit entre :
- La version de Node.js (18.20.8)
- Les dépendances axios/undici qui nécessitent Node.js 20+

---

## ✅ Solution appliquée

### 1. Mise à jour de Node.js vers la version 20

**Fichiers modifiés :**

#### package.json
```json
{
  "engines": {
    "node": ">=20.0.0",
    "npm": ">=9.0.0"
  },
  "dependencies": {
    "axios": "^1.6.2",
    "cheerio": "1.0.0-rc.12"
  }
}
```

#### .nvmrc (nouveau)
```
20.11.0
```

#### render.yaml
```yaml
envVars:
  - key: NODE_VERSION
    value: 20.11.0
```

---

## 🚀 Comment redéployer avec le fix

### Sur Render.com

**Méthode 1 : Redéploiement automatique**
```bash
git add .
git commit -m "Fix: Update Node.js to version 20"
git push
```
→ Render redéploie automatiquement avec Node.js 20

**Méthode 2 : Redéploiement manuel**
1. Dashboard Render → Votre service
2. **Manual Deploy** → **Clear build cache & deploy**

---

## 🔍 Vérifier la version Node.js utilisée

### Localement
```bash
node --version
# Doit afficher: v20.x.x
```

### Sur Render (via les logs)
Cherchez dans les logs de build :
```
Node version: v20.11.0
```

---

## 📋 Checklist de vérification

- [ ] `package.json` contient `"node": ">=20.0.0"`
- [ ] Fichier `.nvmrc` créé avec `20.11.0`
- [ ] `render.yaml` contient `NODE_VERSION: 20.11.0`
- [ ] Code poussé sur GitHub
- [ ] Redéploiement effectué sur Render
- [ ] Logs de build vérifient : Node v20.x.x
- [ ] API accessible et fonctionnelle

---

## 🧪 Tester après le fix

```bash
# Test 1 : API status
curl https://votre-app.onrender.com/

# Test 2 : Endpoint fonctionnel
curl https://votre-app.onrender.com/api/check/Lyon
```

**Résultat attendu :** Réponse JSON correcte sans erreur

---

## 💡 Alternative : Utiliser une version spécifique d'axios

Si vous ne pouvez pas upgrader Node.js, utilisez une version plus ancienne d'axios :

```json
{
  "dependencies": {
    "axios": "1.4.0"
  }
}
```

**Note :** Cette solution n'est pas recommandée car axios 1.4.0 est plus ancienne.

---

## 🔄 Si le problème persiste

### 1. Nettoyer le cache
```bash
# Sur Render : Manual Deploy → Clear build cache & deploy
```

### 2. Vérifier les logs complets
```bash
# Dashboard Render → Logs
# Cherchez "Node version" au début du build
```

### 3. Forcer la version Node.js
Ajoutez dans `render.yaml` :
```yaml
buildCommand: |
  node --version &&
  npm install
```

---

## 📊 Versions compatibles

| Dépendance | Version | Compatible avec |
|------------|---------|----------------|
| Node.js    | 20.11.0 | ✅ Recommandé |
| axios      | 1.6.2   | Node 20+ |
| cheerio    | 1.0.0-rc.12 | Node 18+ |
| express    | 4.18.2  | Node 14+ |

---

## 🎯 Résumé

**Problème :** Node.js 18 incompatible avec axios/undici récent  
**Solution :** Upgrade vers Node.js 20  
**Fichiers modifiés :** package.json, render.yaml, .nvmrc (nouveau)  
**Action requise :** Push + redéploiement

---

## 📞 Support additionnel

Si le problème persiste après avoir appliqué ce fix :

1. Vérifiez les logs complets sur Render
2. Assurez-vous que la version Node.js 20 est bien utilisée
3. Essayez de clear le build cache
4. Contactez le support Render si nécessaire

---

**✅ Le fix a été appliqué dans les fichiers. Il suffit maintenant de push le code et Render utilisera automatiquement Node.js 20.**

```bash
git add .
git commit -m "Fix: Update to Node.js 20 for compatibility"
git push
```
