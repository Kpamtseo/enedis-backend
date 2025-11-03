# 🚀 Guide de Démarrage Rapide

## Installation et lancement en 5 minutes

### Étape 1 : Installation des dépendances

```bash
npm install
```

### Étape 2 : Démarrer le serveur

```bash
npm start
```

Le serveur démarre sur **http://localhost:3000**

### Étape 3 : Tester l'API

Ouvrez un autre terminal et lancez :

```bash
npm test
```

### Étape 4 : Utiliser le frontend

Ouvrez le fichier `public/index.html` dans votre navigateur, ou utilisez un serveur web :

```bash
# Avec Python 3
cd public
python3 -m http.server 8080

# Puis ouvrez : http://localhost:8080
```

---

## 🎯 Tests rapides avec curl

### Test 1 : Vérifier que l'API fonctionne
```bash
curl http://localhost:3000/
```

### Test 2 : Géocoder une ville
```bash
curl http://localhost:3000/api/geocode/Lyon
```

### Test 3 : Vérification complète d'une ville
```bash
curl http://localhost:3000/api/check/Saint-Priest
```

### Test 4 : Vérifier une coupure (POST)
```bash
curl -X POST http://localhost:3000/api/outage \
  -H "Content-Type: application/json" \
  -d '{
    "city": "Lyon",
    "insee": "69123",
    "latitude": 45.764043,
    "longitude": 4.835659,
    "department": "69"
  }'
```

---

## 📁 Structure du projet

```
enedis-backend/
├── server.js              # Serveur principal
├── package.json           # Dépendances
├── test-api.js           # Tests automatisés
├── README.md             # Documentation complète
├── QUICK_START.md        # Ce fichier
├── .env.example          # Configuration exemple
├── .gitignore           # Fichiers à ignorer
└── public/
    └── index.html        # Interface web
```

---

## 🔧 Configuration (optionnel)

Créez un fichier `.env` pour personnaliser :

```bash
cp .env.example .env
```

Puis éditez `.env` :

```env
PORT=3000
NODE_ENV=development
CORS_ORIGINS=*
```

---

## 🌐 Accéder au frontend

### Option 1 : Fichier local
Double-cliquez sur `public/index.html`

### Option 2 : Serveur Python
```bash
cd public
python3 -m http.server 8080
# Ouvrez: http://localhost:8080
```

### Option 3 : Serveur Node
```bash
npm install -g http-server
cd public
http-server -p 8080
# Ouvrez: http://localhost:8080
```

### Option 4 : Intégrer au serveur Express
Ajoutez dans `server.js` :
```javascript
app.use(express.static('public'));
```

---

## ✅ Checklist de démarrage

- [ ] Node.js installé (vérifier avec `node -v`)
- [ ] Dépendances installées (`npm install`)
- [ ] Serveur démarré (`npm start`)
- [ ] Tests passés (`npm test`)
- [ ] Frontend accessible
- [ ] Première recherche effectuée avec succès

---

## 🆘 Problèmes courants

### "Port 3000 already in use"
```bash
# Changer le port
PORT=8080 npm start
```

### "Cannot find module 'express'"
```bash
# Réinstaller les dépendances
rm -rf node_modules package-lock.json
npm install
```

### "API déconnectée" dans le frontend
- Vérifiez que le serveur tourne (`npm start`)
- Vérifiez l'URL dans le frontend : `http://localhost:3000`
- Regardez les logs du serveur

### Erreur CORS
Si vous accédez au frontend depuis un autre domaine, vérifiez la configuration CORS dans `server.js`

---

## 📊 Exemples de villes à tester

- Lyon
- Paris
- Marseille
- Saint-Priest
- Toulouse
- Bordeaux
- Nantes
- Lille

---

## 🚀 Aller plus loin

### Déploiement en production
Voir le fichier `README.md` section "Déploiement"

### Ajouter un rate limiter
```bash
npm install express-rate-limit
```

### Ajouter des logs
```bash
npm install morgan
```

### Mode développement avec auto-reload
```bash
npm run dev
```

---

## 💡 Prochaines étapes

1. ✅ Tester l'API avec votre ville
2. ✅ Personnaliser le frontend
3. ✅ Ajouter des fonctionnalités (historique, notifications, etc.)
4. ✅ Déployer en production

---

## 📞 Support

- Documentation complète : `README.md`
- Tests : `npm test`
- Logs serveur : Consultez la console où tourne `npm start`

---

**🎉 Prêt à commencer ! Lancez `npm start` et testez votre première recherche !**
