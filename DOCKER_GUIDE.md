# 🐳 Guide de Déploiement Docker

## Prérequis

- Docker installé (https://www.docker.com/get-started)
- Docker Compose installé (inclus avec Docker Desktop)

## 🚀 Démarrage rapide avec Docker

### Option 1 : Docker Compose (Recommandé)

Lance l'API backend + le frontend Nginx en un seul commande :

```bash
docker-compose up -d
```

Accès :
- **Frontend** : http://localhost:8080
- **Backend API** : http://localhost:3000

### Option 2 : Docker uniquement (Backend seul)

```bash
# Construire l'image
docker build -t enedis-api .

# Lancer le conteneur
docker run -d \
  --name enedis-api \
  -p 3000:3000 \
  -e NODE_ENV=production \
  enedis-api
```

Accès :
- **Backend API** : http://localhost:3000

---

## 📋 Commandes utiles

### Voir les logs
```bash
# Tous les services
docker-compose logs -f

# API uniquement
docker-compose logs -f api

# Frontend uniquement
docker-compose logs -f frontend
```

### Arrêter les services
```bash
docker-compose down
```

### Redémarrer les services
```bash
docker-compose restart
```

### Reconstruire après modifications
```bash
docker-compose up -d --build
```

### État des conteneurs
```bash
docker-compose ps
```

---

## 🔧 Configuration

### Variables d'environnement

Modifiez le fichier `docker-compose.yml` :

```yaml
environment:
  - PORT=3000
  - NODE_ENV=production
  - CORS_ORIGINS=https://mondomaine.com
```

### Changer les ports

Dans `docker-compose.yml` :

```yaml
ports:
  - "8000:3000"  # Backend sur port 8000
  - "9000:80"    # Frontend sur port 9000
```

---

## 🌐 Déploiement en production

### 1. Sur un VPS

```bash
# Se connecter au serveur
ssh user@votre-serveur.com

# Cloner le repo
git clone <votre-repo>
cd enedis-api

# Lancer avec Docker Compose
docker-compose up -d

# Configurer un reverse proxy (Nginx ou Traefik)
```

### 2. Avec un nom de domaine

Ajoutez dans `docker-compose.yml` :

```yaml
services:
  api:
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.enedis-api.rule=Host(`api.votredomaine.com`)"
```

### 3. Avec HTTPS (Let's Encrypt)

Utilisez Traefik ou Certbot pour obtenir un certificat SSL gratuit.

---

## 📊 Monitoring

### Vérifier la santé des conteneurs

```bash
docker-compose ps
```

Devrait afficher "healthy" pour le service API.

### Inspecter un conteneur

```bash
docker inspect enedis-api
```

### Entrer dans un conteneur

```bash
docker exec -it enedis-api sh
```

---

## 🔄 Mise à jour

```bash
# Récupérer les dernières modifications
git pull

# Reconstruire et redémarrer
docker-compose up -d --build
```

---

## 🧹 Nettoyage

### Supprimer les conteneurs
```bash
docker-compose down
```

### Supprimer les conteneurs + volumes
```bash
docker-compose down -v
```

### Nettoyer les images inutilisées
```bash
docker system prune -a
```

---

## 🐛 Dépannage

### Le conteneur ne démarre pas

```bash
# Voir les logs d'erreur
docker-compose logs api

# Vérifier les ports
netstat -tuln | grep 3000
```

### Problème de CORS

Modifiez `CORS_ORIGINS` dans `docker-compose.yml` :

```yaml
environment:
  - CORS_ORIGINS=http://localhost:8080,https://mondomaine.com
```

### L'API ne répond pas

```bash
# Vérifier que le conteneur tourne
docker ps

# Tester depuis l'intérieur du conteneur
docker exec enedis-api curl http://localhost:3000/
```

---

## 📈 Scaling

Pour plusieurs instances de l'API :

```bash
docker-compose up -d --scale api=3
```

---

## 🔒 Sécurité

### 1. Ne pas exposer l'API directement

Utilisez un reverse proxy (Nginx, Traefik) devant l'API.

### 2. Limiter les connexions

Ajoutez un rate limiter dans le code ou via Nginx.

### 3. Variables sensibles

Utilisez un fichier `.env` pour les secrets :

```bash
# .env
API_KEY=votre_clé_secrète
DATABASE_URL=postgresql://...
```

Puis dans `docker-compose.yml` :

```yaml
env_file:
  - .env
```

---

## 💡 Astuces

### Développement avec hot-reload

```yaml
services:
  api:
    volumes:
      - .:/app
      - /app/node_modules
    command: npm run dev
```

### Logs persistants

```yaml
services:
  api:
    volumes:
      - ./logs:/app/logs
```

---

## 📦 Production-ready setup

```yaml
version: '3.8'

services:
  api:
    build: .
    restart: always
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/"]
      interval: 30s
      timeout: 10s
      retries: 3
    deploy:
      resources:
        limits:
          cpus: '0.5'
          memory: 512M
```

---

**🎉 Votre application est maintenant Dockerisée et prête pour la production !**
