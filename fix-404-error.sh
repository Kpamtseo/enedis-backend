#!/bin/bash

# 🔧 Script pour appliquer le fix de l'erreur 404

echo "╔═══════════════════════════════════════════════════════╗"
echo "║   🔧 Fix Erreur 404 - /api/check/:city               ║"
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
    error "Git n'est pas initialisé"
    exit 1
fi

# Vérifier que server.js existe
if [ ! -f server.js ]; then
    error "server.js introuvable"
    exit 1
fi

info "Vérification du fichier server.js..."

# Vérifier que le fix est appliqué
if grep -q "0.0.0.0" server.js; then
    info "Fix détecté dans server.js ✓"
else
    warning "Le fix ne semble pas être appliqué"
    echo ""
    echo "Le fichier server.js devrait contenir :"
    echo "  - Binding sur '0.0.0.0'"
    echo "  - Appels directs à l'API (pas de localhost)"
    echo "  - Gestion d'erreurs améliorée"
    echo ""
    read -p "Continuer quand même ? (y/N): " confirm
    if [[ ! $confirm =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

echo ""
info "Prêt à pousser le fix sur GitHub"
echo ""
echo "Ce fix corrige :"
echo "  • Erreur 404 sur /api/check/:city"
echo "  • Crash SIGTERM du serveur"
echo "  • Appels localhost qui ne fonctionnent pas sur Render"
echo ""

read -p "Pousser maintenant ? (Y/n): " push_confirm

if [[ ! $push_confirm =~ ^[Nn]$ ]]; then
    info "Ajout de server.js..."
    git add server.js
    
    info "Création du commit..."
    git commit -m "Fix: Remove localhost calls for Render compatibility

- Replace localhost API calls with direct axios calls
- Add detailed logging for debugging
- Improve error handling with non-blocking try/catch
- Add graceful shutdown handlers
- Bind server to 0.0.0.0 for Render compatibility"
    
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
    echo "2. Surveillez les logs sur Dashboard Render"
    echo "3. Cherchez : '🚀 Backend API Enedis - Démarré avec succès'"
    echo "4. Testez l'API :"
    echo ""
    echo "   curl https://enedis-backend-pdqw.onrender.com/"
    echo "   curl https://enedis-backend-pdqw.onrender.com/api/check/Lyon"
    echo ""
    echo "5. Vérifiez qu'il n'y a plus d'erreur 404"
    echo ""
    
    echo "Voulez-vous voir le guide complet du fix ? (y/N): "
    read show_guide
    if [[ $show_guide =~ ^[Yy]$ ]]; then
        if [ -f FIX_404_ERROR.md ]; then
            cat FIX_404_ERROR.md
        else
            echo "FIX_404_ERROR.md introuvable"
        fi
    fi
else
    echo ""
    warning "Push annulé. Pour pousser plus tard :"
    echo "  git add server.js"
    echo "  git commit -m 'Fix: Remove localhost calls'"
    echo "  git push"
fi

echo ""
info "Pour suivre le déploiement :"
echo "  → https://dashboard.render.com"
echo ""
