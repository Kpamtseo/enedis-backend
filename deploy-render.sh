#!/bin/bash

# 🚀 Script de déploiement automatique sur Render
# Ce script prépare et déploie votre API Enedis sur Render.com

set -e

echo "╔═══════════════════════════════════════════════════════╗"
echo "║   🚀 Déploiement API Enedis sur Render               ║"
echo "╚═══════════════════════════════════════════════════════╝"
echo ""

# Couleurs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Fonction pour afficher les messages
info() {
    echo -e "${GREEN}✓${NC} $1"
}

error() {
    echo -e "${RED}✗${NC} $1"
}

warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

# Vérifier si Git est initialisé
if [ ! -d .git ]; then
    info "Initialisation de Git..."
    git init
    git branch -M main
fi

# Vérifier les fichiers nécessaires
info "Vérification des fichiers..."

required_files=("package.json" "server.js" "render.yaml")
for file in "${required_files[@]}"; do
    if [ ! -f "$file" ]; then
        error "Fichier manquant: $file"
        exit 1
    fi
done

info "Tous les fichiers requis sont présents"

# Vérifier si les dépendances sont installées
if [ ! -d "node_modules" ]; then
    warning "node_modules manquant. Installation des dépendances..."
    npm install
fi

# Tester l'API localement
info "Test de l'API localement..."
npm test 2>/dev/null || warning "Les tests ont échoué ou npm test n'est pas configuré"

# Demander le dépôt GitHub
echo ""
echo "📦 Configuration du dépôt GitHub"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Vérifier si le remote existe déjà
if git remote get-url origin &>/dev/null; then
    REPO_URL=$(git remote get-url origin)
    echo "Remote origin déjà configuré: $REPO_URL"
    read -p "Voulez-vous le changer? (y/N): " change_remote
    if [[ $change_remote =~ ^[Yy]$ ]]; then
        read -p "URL du dépôt GitHub (ex: https://github.com/user/repo.git): " REPO_URL
        git remote set-url origin "$REPO_URL"
    fi
else
    read -p "URL du dépôt GitHub (ex: https://github.com/user/repo.git): " REPO_URL
    git remote add origin "$REPO_URL"
fi

# Ajouter tous les fichiers
info "Ajout des fichiers au commit..."
git add .

# Vérifier s'il y a des changements
if git diff --cached --quiet; then
    warning "Aucun changement à committer"
else
    # Créer le commit
    read -p "Message de commit (Entrée pour 'Deploy to Render'): " commit_msg
    commit_msg=${commit_msg:-"Deploy to Render"}
    git commit -m "$commit_msg"
    info "Commit créé: $commit_msg"
fi

# Pousser sur GitHub
echo ""
read -p "Pousser sur GitHub maintenant? (Y/n): " push_confirm
if [[ ! $push_confirm =~ ^[Nn]$ ]]; then
    info "Push vers GitHub..."
    git push -u origin main
    info "Code poussé avec succès!"
fi

# Instructions pour Render
echo ""
echo "╔═══════════════════════════════════════════════════════╗"
echo "║   🎯 Prochaines étapes sur Render.com                ║"
echo "╚═══════════════════════════════════════════════════════╝"
echo ""
echo "1. Allez sur https://render.com et connectez-vous"
echo "2. Cliquez sur 'New +' → 'Blueprint'"
echo "3. Connectez votre dépôt GitHub"
echo "4. Render détectera automatiquement render.yaml"
echo "5. Cliquez sur 'Apply' pour déployer"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Votre API sera accessible à:"
echo "https://enedis-api.onrender.com"
echo ""
echo "Pour tester après déploiement:"
echo "curl https://enedis-api.onrender.com/api/check/Lyon"
echo ""
info "Déploiement préparé avec succès!"
echo ""
