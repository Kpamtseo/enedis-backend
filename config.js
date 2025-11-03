// config.js - Configuration de l'API

// 🔧 Configuration de l'URL de l'API
// Changez cette valeur selon votre environnement

const API_CONFIG = {
    // Environnement de développement (local)
    LOCAL: 'http://localhost:3000',
    
    // Environnement de production (Render)
    // ⚠️ REMPLACEZ par votre vraie URL Render après déploiement
    RENDER: 'https://enedis-api.onrender.com',
    
    // Environnement actif (changez 'LOCAL' en 'RENDER' après déploiement)
    CURRENT: 'LOCAL'  // ou 'RENDER'
};

// URL de l'API à utiliser
const API_URL = API_CONFIG[API_CONFIG.CURRENT];

// Détection automatique de l'environnement (optionnel)
// Décommentez pour activer la détection automatique
/*
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    API_URL = API_CONFIG.LOCAL;
} else {
    API_URL = API_CONFIG.RENDER;
}
*/

console.log('🔗 API URL:', API_URL);
