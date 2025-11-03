# 📦 Backend API Enedis - Vue d'ensemble du projet

## 🎯 Objectif

Ce projet fournit un **backend API complet** pour récupérer les informations de coupure électrique depuis le site Enedis.fr en temps réel.

---

## 📂 Structure du projet

```
enedis-backend/
│
├── 📄 server.js                  # Serveur Express principal avec toutes les routes
├── 📄 package.json               # Dépendances Node.js
├── 📄 test-api.js               # Script de tests automatisés
│
├── 📁 public/
│   └── index.html               # Interface web frontend
│
├── 📄 .env.example              # Configuration exemple
├── 📄 .gitignore               # Fichiers à ignorer par Git
│
├── 🐳 Dockerfile                # Image Docker
├── 🐳 docker-compose.yml        # Orchestration Docker
├── 🐳 nginx.conf               # Configuration Nginx pour frontend
│
└── 📚 Documentation/
    ├── README.md                # Documentation complète
    ├── QUICK_START.md          # Démarrage rapide
    ├── DOCKER_GUIDE.md         # Guide Docker
    └── INDEX.md                # Ce fichier
```

---

## 🚀 Démarrage rapide

### Option 1 : Sans Docker (Développement)

```bash
# 1. Installer les dépendances
npm install

# 2. Démarrer le serveur
npm start

# 3. Tester l'API
npm test

# 4. Ouvrir le frontend
# Ouvrir public/index.html dans un navigateur
```

### Option 2 : Avec Docker (Production)

```bash
# Lancer l'API + Frontend
docker-compose up -d

# Accès:
# - Frontend: http://localhost:8080
# - API: http://localhost:3000
```

---

## 📡 Endpoints API

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/` | Informations sur l'API |
| GET | `/api/geocode/:city` | Géocoder une ville |
| POST | `/api/outage` | Vérifier les coupures |
| GET | `/api/check/:city` | Vérification complète |
| GET | `/api/departments` | Liste des départements |

---

## 🛠️ Technologies utilisées

### Backend
- **Node.js** - Runtime JavaScript
- **Express** - Framework web
- **Axios** - Client HTTP
- **Cheerio** - Parsing HTML
- **CORS** - Gestion des origines croisées

### Frontend
- **HTML5/CSS3** - Interface utilisateur
- **JavaScript Vanilla** - Logique frontend
- **Fetch API** - Requêtes HTTP

### Déploiement
- **Docker** - Containerisation
- **Docker Compose** - Orchestration
- **Nginx** - Serveur web (frontend)

---

## 📖 Documentation

### Pour commencer
1. **QUICK_START.md** - Installation et premiers pas en 5 minutes
2. **README.md** - Documentation complète de l'API

### Pour le déploiement
3. **DOCKER_GUIDE.md** - Guide Docker complet
4. **Dockerfile** - Configuration de l'image Docker

### Pour le développement
5. **test-api.js** - Tests automatisés
6. **.env.example** - Variables d'environnement

---

## 🎓 Exemples d'utilisation

### 1. Vérifier une ville avec curl

```bash
curl http://localhost:3000/api/check/Lyon
```

### 2. Vérifier une ville avec JavaScript

```javascript
const response = await fetch('http://localhost:3000/api/check/Lyon');
const data = await response.json();

console.log(data.outage.hasOutage ? 'Coupure!' : 'Pas de coupure');
```

### 3. Vérifier avec Python

```python
import requests

response = requests.get('http://localhost:3000/api/check/Lyon')
data = response.json()

print(f"Coupure: {data['outage']['hasOutage']}")
```

---

## 🔧 Configuration

### Variables d'environnement (.env)

```env
PORT=3000
NODE_ENV=development
CORS_ORIGINS=*
REQUEST_TIMEOUT=10000
```

### Changer le port

```bash
PORT=8080 npm start
```

---

## 📊 Fonctionnalités principales

✅ **Géocodage automatique** - Trouve les coordonnées GPS de n'importe quelle ville française  
✅ **Vérification temps réel** - Interroge directement Enedis.fr  
✅ **Parsing intelligent** - Extrait les informations de coupure depuis le HTML  
✅ **API RESTful** - Endpoints bien structurés  
✅ **Tests automatisés** - Suite de tests complète  
✅ **Docker ready** - Déploiement simplifié  
✅ **Documentation complète** - Guides et exemples  
✅ **CORS configuré** - Utilisable depuis n'importe quel frontend  
✅ **Gestion d'erreurs** - Messages d'erreur clairs  
✅ **Numéros d'urgence** - Pour tous les départements  

---

## 🎯 Cas d'usage

### Pour les particuliers
- Vérifier si une coupure est en cours dans son quartier
- Obtenir le numéro d'urgence de son département
- Consulter les travaux programmés

### Pour les développeurs
- Intégrer les données Enedis dans une application
- Créer des notifications de coupure
- Développer un dashboard de monitoring

### Pour les entreprises
- Surveiller l'état du réseau électrique
- Alerter automatiquement en cas de coupure
- Planifier les opérations selon les interruptions

---

## 🔄 Workflow de développement

1. **Développement local** : `npm run dev` (avec nodemon)
2. **Tests** : `npm test`
3. **Build Docker** : `docker build -t enedis-api .`
4. **Déploiement** : `docker-compose up -d`

---

## 🚦 Statuts de coupure

L'API retourne différents statuts :

- `ok` - Pas de coupure signalée
- `outage` - Coupure d'électricité en cours
- `scheduled` - Travaux programmés
- `unknown` - Statut indéterminé

---

## 📞 Support

### Documentation
- `README.md` - Documentation API complète
- `QUICK_START.md` - Guide de démarrage
- `DOCKER_GUIDE.md` - Guide Docker

### Tests
```bash
npm test
```

### Logs
```bash
# Sans Docker
npm start  # Voir les logs dans la console

# Avec Docker
docker-compose logs -f
```

---

## 🔐 Sécurité

⚠️ **Important** : Cette API interroge le site public d'Enedis

- ✅ Pas de données personnelles stockées
- ✅ Pas d'authentification nécessaire (données publiques)
- ⚠️ À utiliser de manière responsable (pas de spam)
- ⚠️ Ajouter un rate limiter en production

---

## 🎁 Fonctionnalités bonus

- **Health check** - Monitoring de l'état de l'API
- **Liste départements** - Tous les numéros d'urgence
- **Alternatives villes** - Si plusieurs villes ont le même nom
- **Timestamp** - Date de la dernière vérification
- **URL Enedis** - Lien direct vers la page officielle

---

## 🚀 Évolutions possibles

- [ ] Ajouter un système de cache (Redis)
- [ ] Implémenter un rate limiter
- [ ] Ajouter des webhooks pour notifications
- [ ] Créer une application mobile
- [ ] Historique des coupures
- [ ] Statistiques par département
- [ ] Notifications par email/SMS
- [ ] Carte interactive des coupures

---

## 📜 Licence

MIT - Vous êtes libre d'utiliser, modifier et distribuer ce code.

---

## ⚡ Démarrez maintenant !

```bash
npm install && npm start
```

Puis ouvrez : http://localhost:3000

---

**Bon développement ! 🎉**
