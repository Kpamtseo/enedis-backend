#!/bin/bash

# 🔧 Script de fix pour l'erreur Node.js

echo "╔═══════════════════════════════════════════════════════╗"
echo "║   🔧 Application du fix Node.js 20                   ║"
echo "╚═══════════════════════════════════════════════════════╝"
echo ""

# Couleurs
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

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
    error "Git n'est pas initialisé. Lancez d'abord ./deploy-render.sh"
    exit 1
fi

info "Vérification des fichiers modifiés..."

# Vérifier que les fichiers ont bien été mis à jour
if grep -q ">=20.0.0" package.json; then
    info "package.json ✓ (Node.js 20)"
else
    error "package.json n'a pas été mis à jour"
    exit 1
fi

if grep -q "20.11.0" render.yaml; then
    info "render.yaml ✓ (Node.js 20)"
else
    error "render.yaml n'a pas été mis à jour"
    exit 1
fi

if [ -f .nvmrc ]; then
    info ".nvmrc ✓"
else
    error ".nvmrc manquant"
    exit 1
fi

echo ""
info "Tous les fichiers sont à jour !"
echo ""

# Demander confirmation pour push
read -p "Push le fix sur GitHub maintenant ? (Y/n): " push_confirm

if [[ ! $push_confirm =~ ^[Nn]$ ]]; then
    info "Ajout des fichiers..."
    git add .
    
    info "Création du commit..."
    git commit -m "Fix: Update to Node.js 20 for compatibility with axios/undici"
    
    info "Push vers GitHub..."
    git push
    
    echo ""
    info "✅ Fix poussé avec succès !"
    echo ""
    echo "╔═══════════════════════════════════════════════════════╗"
    echo "║   📊 Prochaines étapes                                ║"
    echo "╚═══════════════════════════════════════════════════════╝"
    echo ""
    echo "1. Render va automatiquement redéployer (2-3 minutes)"
    echo "2. Vérifiez les logs sur Render Dashboard"
    echo "3. Cherchez : 'Node version: v20.x.x'"
    echo "4. Testez l'API : curl https://votre-app.onrender.com/"
    echo ""
    
    # Demander si on veut forcer le redéploiement
    read -p "Voulez-vous forcer le redéploiement maintenant ? (y/N): " force_deploy
    
    if [[ $force_deploy =~ ^[Yy]$ ]]; then
        echo ""
        warning "Pour forcer le redéploiement :"
        echo "1. Allez sur https://dashboard.render.com"
        echo "2. Sélectionnez votre service 'enedis-api'"
        echo "3. Cliquez sur 'Manual Deploy'"
        echo "4. Sélectionnez 'Clear build cache & deploy'"
        echo ""
    fi
else
    echo ""
    warning "Push annulé. Pour pousser plus tard :"
    echo "  git add ."
    echo "  git commit -m 'Fix: Node.js 20 update'"
    echo "  git push"
fi

echo ""
info "Pour plus d'informations, consultez TROUBLESHOOTING.md"
echo ""
