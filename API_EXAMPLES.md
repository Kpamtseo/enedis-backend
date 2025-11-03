# 📋 Exemples de Réponses API

Ce fichier contient des exemples de réponses pour chaque endpoint de l'API.

---

## 1. Route principale (/)

### Requête
```bash
GET http://localhost:3000/
```

### Réponse
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

## 2. Géocodage d'une ville

### Requête
```bash
GET http://localhost:3000/api/geocode/Lyon
```

### Réponse (Succès)
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
    "alternatives": [
      {
        "name": "Lyon 1er Arrondissement",
        "postcode": "69001",
        "department": "69"
      },
      {
        "name": "Lyon 2e Arrondissement",
        "postcode": "69002",
        "department": "69"
      }
    ]
  }
}
```

### Réponse (Ville non trouvée)
```json
{
  "error": "Ville non trouvée",
  "city": "VilleInexistante"
}
```

---

## 3. Vérification des coupures (POST)

### Requête
```bash
POST http://localhost:3000/api/outage
Content-Type: application/json

{
  "city": "Lyon",
  "insee": "69123",
  "latitude": 45.764043,
  "longitude": 4.835659,
  "department": "69",
  "postcode": "69000"
}
```

### Réponse (Pas de coupure)
```json
{
  "success": true,
  "city": "Lyon",
  "department": "69",
  "timestamp": "2025-11-03T14:30:25.123Z",
  "enedisURL": "https://www.enedis.fr/resultat-panne-interruption?adresse=Lyon&insee=69123&long=4.835659&lat=45.764043&type=municipality&CPVille=Lyon+69000&street=&name=Lyon&departement=69&district=&city=Lyon",
  "data": {
    "hasOutage": false,
    "message": "Aucune coupure signalée",
    "status": "ok",
    "details": []
  }
}
```

### Réponse (Coupure en cours)
```json
{
  "success": true,
  "city": "Saint-Priest",
  "department": "69",
  "timestamp": "2025-11-03T14:30:25.123Z",
  "enedisURL": "https://www.enedis.fr/resultat-panne-interruption?adresse=Saint-Priest&insee=69290&long=4.94422&lat=45.701894&type=municipality&CPVille=Saint-Priest+69800&street=&name=Saint-Priest&departement=69&district=&city=Saint-Priest",
  "data": {
    "hasOutage": true,
    "message": "Coupure d'électricité en cours",
    "status": "outage",
    "details": [
      "Intervention en cours sur le réseau",
      "Délai de résolution: 2 heures estimées"
    ],
    "estimatedTime": ["14h30", "16h30"]
  }
}
```

### Réponse (Travaux programmés)
```json
{
  "success": true,
  "city": "Marseille",
  "department": "13",
  "timestamp": "2025-11-03T14:30:25.123Z",
  "enedisURL": "https://www.enedis.fr/resultat-panne-interruption?...",
  "data": {
    "hasOutage": true,
    "message": "Travaux programmés sur le réseau",
    "status": "scheduled",
    "details": [
      "Travaux de maintenance programmés",
      "Date: 05/11/2025",
      "Durée: 9h00 à 12h00"
    ]
  }
}
```

---

## 4. Vérification complète d'une ville

### Requête
```bash
GET http://localhost:3000/api/check/Saint-Priest
```

### Réponse (Pas de coupure)
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
    "hasOutage": false,
    "message": "Aucune coupure signalée",
    "status": "ok",
    "details": []
  },
  "emergencyNumber": "09 72 67 50 69",
  "timestamp": "2025-11-03T14:30:25.123Z"
}
```

### Réponse (Avec coupure)
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
      "Les équipes Enedis interviennent",
      "Secteur concerné: Centre-ville",
      "Nombre de clients impactés: Environ 250",
      "Heure de rétablissement prévue: 16h30"
    ],
    "estimatedTime": ["16h30"]
  },
  "emergencyNumber": "09 72 67 50 69",
  "timestamp": "2025-11-03T14:30:25.123Z"
}
```

---

## 5. Liste des départements

### Requête
```bash
GET http://localhost:3000/api/departments
```

### Réponse
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
    },
    {
      "code": "03",
      "emergencyNumber": "09 72 67 50 03"
    },
    "... (92 autres départements)",
    {
      "code": "2A",
      "emergencyNumber": "09 72 67 50 2A"
    },
    {
      "code": "2B",
      "emergencyNumber": "09 72 67 50 2B"
    }
  ]
}
```

---

## 6. Erreurs courantes

### Ville non trouvée (404)
```json
{
  "error": "Ville non trouvée",
  "city": "VilleInexistante"
}
```

### Paramètres manquants (400)
```json
{
  "error": "Paramètres manquants",
  "required": ["city", "insee"]
}
```

### Erreur serveur (500)
```json
{
  "error": "Erreur lors de la récupération des données Enedis",
  "message": "Timeout après 10000ms"
}
```

### Route non trouvée (404)
```json
{
  "error": "Route non trouvée",
  "availableEndpoints": [
    "GET /",
    "GET /api/geocode/:city",
    "POST /api/outage",
    "GET /api/check/:city",
    "GET /api/departments"
  ]
}
```

---

## 7. Cas particuliers

### Statut indéterminé
```json
{
  "success": true,
  "city": "Paris",
  "department": "75",
  "timestamp": "2025-11-03T14:30:25.123Z",
  "enedisURL": "https://www.enedis.fr/resultat-panne-interruption?...",
  "data": {
    "hasOutage": false,
    "message": "",
    "status": "unknown",
    "details": [],
    "rawContent": "Premier extrait du contenu de la page Enedis..."
  }
}
```

### Multiples villes avec le même nom
```json
{
  "success": true,
  "data": {
    "name": "Saint-Denis",
    "insee": "93066",
    "postcode": "93200",
    "department": "93",
    "latitude": 48.936257,
    "longitude": 2.357408,
    "alternatives": [
      {
        "name": "Saint-Denis",
        "postcode": "97400",
        "department": "974"
      }
    ]
  }
}
```

---

## 📊 Codes de statut HTTP

- `200` - Succès
- `400` - Requête invalide (paramètres manquants)
- `404` - Ressource non trouvée (ville inexistante, route invalide)
- `500` - Erreur serveur (timeout, erreur Enedis)

---

## 🔄 Format de timestamp

Tous les timestamps sont au format ISO 8601 :
```
2025-11-03T14:30:25.123Z
```

Pour le parser en JavaScript :
```javascript
const date = new Date(timestamp);
console.log(date.toLocaleString('fr-FR'));
// Affiche: "03/11/2025 15:30:25"
```

---

## 📝 Notes importantes

1. **Délais estimatifs** : Les heures de rétablissement sont données à titre indicatif
2. **Cache** : Les données ne sont pas mises en cache, chaque requête interroge Enedis
3. **CORS** : Toutes les origines sont autorisées par défaut
4. **Timeout** : Les requêtes timeout après 10 secondes

---

Ces exemples peuvent être utilisés pour :
- 📚 Documentation
- 🧪 Tests
- 🎓 Formation
- 🔍 Débogage
