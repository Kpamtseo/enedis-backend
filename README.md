# 🔌 Backend API - Enedis Coupure Électrique

Backend Node.js pour récupérer les informations de coupure électrique depuis le site Enedis.fr

## 📋 Prérequis

- Node.js >= 14.0.0
- npm ou yarn

## 🚀 Installation

```bash
# Installation des dépendances
npm install

# Ou avec yarn
yarn install
```

## 🏃 Démarrage

```bash
# Mode production
npm start

# Mode développement (avec auto-reload)
npm run dev

# Tests de l'API
npm test
```

Le serveur démarre sur `http://localhost:3000`

## 📡 Endpoints disponibles

### 1. Route principale
```
GET /
```
Retourne les informations sur l'API et les endpoints disponibles.

**Réponse:**
```json
{
  "status": "ok",
  "message": "API Enedis Coupure - Backend opérationnel",
  "endpoints": {
    "geocode": "/api/geocode/:city",
    "outage": "/api/outage",
    "checkCity": "/api/check/:city"
  }
}
```

---

### 2. Géocodage d'une ville
```
GET /api/geocode/:city
```
Récupère les informations géographiques d'une ville française.

**Paramètres:**
- `city` (string): Nom de la ville

**Exemple:**
```bash
curl http://localhost:3000/api/geocode/Lyon
```

**Réponse:**
```json
{
  "success": true,
  "data": {
    "name": "Lyon",
    "insee": "69123",
    "postcode": "69000",
    "department": "69",
    "latitude": 45.764043,
    "longitude": 4.835659,
    "alternatives": []
  }
}
```

---

### 3. Vérification des coupures
```
POST /api/outage
```
Interroge le site Enedis pour vérifier s'il y a des coupures.

**Body (JSON):**
```json
{
  "city": "Lyon",
  "insee": "69123",
  "latitude": 45.764043,
  "longitude": 4.835659,
  "department": "69",
  "postcode": "69000"
}
```

**Exemple:**
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

**Réponse:**
```json
{
  "success": true,
  "city": "Lyon",
  "department": "69",
  "timestamp": "2025-11-03T10:30:00.000Z",
  "enedisURL": "https://www.enedis.fr/resultat-panne-interruption?...",
  "data": {
    "hasOutage": false,
    "message": "Aucune coupure signalée",
    "status": "ok",
    "details": []
  }
}
```

**Statuts possibles:**
- `ok`: Pas de coupure
- `outage`: Coupure en cours
- `scheduled`: Travaux programmés
- `unknown`: Statut indéterminé

---

### 4. Vérification complète d'une ville
```
GET /api/check/:city
```
Effectue le géocodage ET la vérification des coupures en une seule requête.

**Paramètres:**
- `city` (string): Nom de la ville

**Exemple:**
```bash
curl http://localhost:3000/api/check/Saint-Priest
```

**Réponse:**
```json
{
  "success": true,
  "city": "Saint-Priest",
  "location": {
    "insee": "69290",
    "postcode": "69800",
    "department": "69",
    "coordinates": {
      "latitude": 45.701894,
      "longitude": 4.94422
    }
  },
  "outage": {
    "hasOutage": true,
    "message": "Coupure d'électricité en cours",
    "status": "outage",
    "details": [
      "Intervention en cours",
      "Délai estimé: 2h"
    ]
  },
  "emergencyNumber": "09 72 67 50 69",
  "timestamp": "2025-11-03T10:30:00.000Z"
}
```

---

### 5. Liste des départements
```
GET /api/departments
```
Retourne la liste de tous les départements avec leurs numéros d'urgence.

**Exemple:**
```bash
curl http://localhost:3000/api/departments
```

**Réponse:**
```json
{
  "success": true,
  "count": 97,
  "departments": [
    {
      "code": "01",
      "emergencyNumber": "09 72 67 50 01"
    },
    {
      "code": "02",
      "emergencyNumber": "09 72 67 50 02"
    }
    // ...
  ]
}
```

---

## 🔧 Architecture

```
.
├── server.js           # Serveur Express principal
├── package.json        # Dépendances et scripts
├── test-api.js        # Tests automatisés
└── README.md          # Cette documentation
```

### Dépendances

- **express**: Framework web
- **axios**: Client HTTP pour les requêtes
- **cors**: Gestion des CORS
- **cheerio**: Parsing HTML (comme jQuery côté serveur)

---

## 🧪 Tests

Le fichier `test-api.js` contient des tests pour tous les endpoints:

```bash
npm test
```

Les tests vérifient:
- ✅ Route principale
- ✅ Géocodage de ville
- ✅ Vérification complète
- ✅ POST de vérification des coupures
- ✅ Liste des départements
- ✅ Gestion des erreurs (ville inexistante)

---

## 🌐 Utilisation avec un frontend

### Exemple JavaScript (Fetch API)

```javascript
// Vérifier une ville
async function checkCity(cityName) {
  const response = await fetch(`http://localhost:3000/api/check/${cityName}`);
  const data = await response.json();
  
  if (data.success) {
    console.log(`Ville: ${data.city}`);
    console.log(`Coupure: ${data.outage.hasOutage ? 'OUI' : 'NON'}`);
    console.log(`Message: ${data.outage.message}`);
    console.log(`Urgence: ${data.emergencyNumber}`);
  }
}

checkCity('Lyon');
```

### Exemple avec Axios

```javascript
import axios from 'axios';

// POST pour vérifier une coupure
const checkOutage = async () => {
  const response = await axios.post('http://localhost:3000/api/outage', {
    city: 'Paris',
    insee: '75056',
    latitude: 48.8566,
    longitude: 2.3522,
    department: '75'
  });
  
  return response.data;
};
```

---

## 🔒 Sécurité et limitations

### CORS
Le backend autorise toutes les origines par défaut. Pour la production:

```javascript
app.use(cors({
  origin: 'https://votre-domaine.com',
  methods: ['GET', 'POST']
}));
```

### Rate Limiting
Pour éviter le spam, ajoutez un rate limiter:

```bash
npm install express-rate-limit
```

```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // 100 requêtes max
});

app.use('/api/', limiter);
```

### Timeout
Les requêtes ont un timeout de 10 secondes pour éviter les blocages.

---

## 🚀 Déploiement

### Heroku

```bash
# Login Heroku
heroku login

# Créer l'app
heroku create mon-api-enedis

# Déployer
git push heroku main

# Variables d'environnement
heroku config:set PORT=3000
```

### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

```bash
docker build -t enedis-api .
docker run -p 3000:3000 enedis-api
```

### VPS (Ubuntu/Debian)

```bash
# Installer Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Cloner et installer
git clone <votre-repo>
cd enedis-api
npm install --production

# Utiliser PM2 pour la production
npm install -g pm2
pm2 start server.js --name enedis-api
pm2 startup
pm2 save
```

---

## 📊 Monitoring

### Logs
```bash
# Avec PM2
pm2 logs enedis-api

# Logs en temps réel
pm2 logs enedis-api --lines 100
```

### Santé du serveur
```bash
curl http://localhost:3000/
```

---

## 🐛 Dépannage

### Le serveur ne démarre pas
```bash
# Vérifier que le port 3000 est libre
lsof -i :3000

# Changer le port
PORT=8080 npm start
```

### Erreur CORS
Vérifiez que le CORS est bien activé dans `server.js`

### Timeout sur Enedis
Le site Enedis peut être lent. Le timeout est configuré à 10s.

---

## 📝 Licence

MIT

---

## 👥 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à ouvrir une issue ou une pull request.

---

## 📞 Support

Pour toute question sur l'API Enedis officielle, contactez Enedis directement.
Pour les questions sur ce backend, ouvrez une issue sur GitHub.

---

## ⚠️ Avertissement

Cette API interroge le site public d'Enedis. Elle n'est pas officielle et ne doit pas être utilisée de manière abusive. Respectez les conditions d'utilisation d'Enedis.
