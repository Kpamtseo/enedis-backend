// server.js - Backend API pour récupérer les informations de coupure Enedis

const express = require('express');
const axios = require('axios');
const cors = require('cors');
const cheerio = require('cheerio');

const app = express();
// Render fournit le port via process.env.PORT
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// API gouvernementale pour le géocodage
const GEO_API_URL = 'https://geo.api.gouv.fr/communes';

/**
 * Route de test
 */
app.get('/', (req, res) => {
    res.json({
        status: 'ok',
        message: 'API Enedis Coupure - Backend opérationnel',
        endpoints: {
            geocode: '/api/geocode/:city',
            outage: '/api/outage',
            checkCity: '/api/check/:city'
        }
    });
});

/**
 * Géocodage d'une ville
 * GET /api/geocode/:city
 */
app.get('/api/geocode/:city', async (req, res) => {
    try {
        const { city } = req.params;
        
        const response = await axios.get(GEO_API_URL, {
            params: {
                nom: city,
                fields: 'nom,code,codesPostaux,centre,codeDepartement',
                format: 'json',
                geometry: 'centre'
            }
        });

        if (response.data.length === 0) {
            return res.status(404).json({
                error: 'Ville non trouvée',
                city: city
            });
        }

        const commune = response.data[0];
        const geoData = {
            name: commune.nom,
            insee: commune.code,
            postcode: commune.codesPostaux[0],
            department: commune.codeDepartement,
            latitude: commune.centre.coordinates[1],
            longitude: commune.centre.coordinates[0],
            alternatives: response.data.slice(1, 5).map(c => ({
                name: c.nom,
                postcode: c.codesPostaux[0],
                department: c.codeDepartement
            }))
        };

        res.json({
            success: true,
            data: geoData
        });

    } catch (error) {
        console.error('Erreur géocodage:', error.message);
        res.status(500).json({
            error: 'Erreur lors du géocodage',
            message: error.message
        });
    }
});

/**
 * Récupération des informations de coupure depuis Enedis
 * POST /api/outage
 * Body: { city, insee, latitude, longitude, department }
 */
app.post('/api/outage', async (req, res) => {
    try {
        const { city, insee, latitude, longitude, department, postcode } = req.body;

        if (!city || !insee) {
            return res.status(400).json({
                error: 'Paramètres manquants',
                required: ['city', 'insee']
            });
        }

        // Construction de l'URL Enedis
        const enedisURL = `https://www.enedis.fr/resultat-panne-interruption`;
        const params = {
            adresse: city,
            insee: insee,
            long: longitude || 0,
            lat: latitude || 0,
            type: 'municipality',
            CPVille: `${city} ${postcode || ''}`.trim(),
            street: '',
            name: city,
            departement: department || '',
            district: '',
            city: city
        };

        // Requête vers Enedis avec headers pour simuler un navigateur
        const response = await axios.get(enedisURL, {
            params: params,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                'Accept-Language': 'fr-FR,fr;q=0.9,en;q=0.8',
                'Referer': 'https://www.enedis.fr/'
            },
            timeout: 10000
        });

        // Parse du HTML avec Cheerio
        const $ = cheerio.load(response.data);
        
        // Extraction des informations de coupure
        const outageInfo = extractOutageInfo($);

        res.json({
            success: true,
            city: city,
            department: department,
            timestamp: new Date().toISOString(),
            enedisURL: `${enedisURL}?${new URLSearchParams(params).toString()}`,
            data: outageInfo
        });

    } catch (error) {
        console.error('Erreur récupération coupure:', error.message);
        res.status(500).json({
            error: 'Erreur lors de la récupération des données Enedis',
            message: error.message
        });
    }
});

/**
 * Vérification complète d'une ville (géocodage + coupure)
 * GET /api/check/:city
 */
app.get('/api/check/:city', async (req, res) => {
    try {
        const { city } = req.params;
        
        console.log(`📍 Request: /api/check/${city}`);

        // 1. Géocodage
        console.log(`🔍 Géocodage de ${city}...`);
        const geoResponse = await axios.get(`${GEO_API_URL}`, {
            params: {
                nom: city,
                fields: 'nom,code,codesPostaux,centre,codeDepartement',
                format: 'json',
                geometry: 'centre'
            },
            timeout: 10000
        });
        
        if (!geoResponse.data || geoResponse.data.length === 0) {
            console.log(`❌ Ville non trouvée: ${city}`);
            return res.status(404).json({
                error: 'Ville non trouvée',
                city: city
            });
        }

        const commune = geoResponse.data[0];
        const geoData = {
            name: commune.nom,
            insee: commune.code,
            postcode: commune.codesPostaux[0],
            department: commune.codeDepartement,
            latitude: commune.centre.coordinates[1],
            longitude: commune.centre.coordinates[0]
        };
        
        console.log(`✅ Géocodage réussi: ${geoData.name}`);

        // 2. Vérification des coupures
        console.log(`🔍 Vérification des coupures pour ${geoData.name}...`);
        const enedisURL = `https://www.enedis.fr/resultat-panne-interruption`;
        const params = {
            adresse: geoData.name,
            insee: geoData.insee,
            long: geoData.longitude,
            lat: geoData.latitude,
            type: 'municipality',
            CPVille: `${geoData.name} ${geoData.postcode}`,
            street: '',
            name: geoData.name,
            departement: geoData.department,
            district: '',
            city: geoData.name
        };

        let outageInfo = {
            hasOutage: false,
            message: 'Informations non disponibles',
            status: 'unknown',
            details: []
        };

        try {
            const outageResponse = await axios.get(enedisURL, {
                params: params,
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                    'Accept-Language': 'fr-FR,fr;q=0.9,en;q=0.8',
                    'Referer': 'https://www.enedis.fr/'
                },
                timeout: 15000
            });

            const $ = cheerio.load(outageResponse.data);
            outageInfo = extractOutageInfo($);
            console.log(`✅ Vérification coupure réussie: ${outageInfo.status}`);
            
        } catch (enedisError) {
            console.warn(`⚠️  Erreur lors de la vérification Enedis (non bloquante): ${enedisError.message}`);
            outageInfo.message = 'Impossible de vérifier les coupures sur Enedis';
            outageInfo.error = enedisError.message;
        }

        // Réponse réussie
        res.json({
            success: true,
            city: geoData.name,
            location: {
                insee: geoData.insee,
                postcode: geoData.postcode,
                department: geoData.department,
                coordinates: {
                    latitude: geoData.latitude,
                    longitude: geoData.longitude
                }
            },
            outage: outageInfo,
            emergencyNumber: `09 72 67 50 ${geoData.department}`,
            timestamp: new Date().toISOString()
        });
        
        console.log(`✅ Réponse envoyée pour ${city}`);

    } catch (error) {
        console.error('❌ Erreur vérification complète:', error.message);
        console.error('Stack:', error.stack);
        
        res.status(500).json({
            error: 'Erreur lors de la vérification',
            message: error.message,
            city: req.params.city
        });
    }
});

/**
 * Fonction d'extraction des informations de coupure depuis le HTML
 */
function extractOutageInfo($) {
    const outageInfo = {
        hasOutage: false,
        message: '',
        status: 'unknown',
        details: []
    };

    try {
        // Recherche de messages de coupure dans le contenu
        const pageText = $('body').text().toLowerCase();

        // Patterns de détection
        const patterns = {
            noOutage: [
                'aucune panne',
                'pas de coupure',
                'réseau fonctionne normalement',
                'tout fonctionne'
            ],
            hasOutage: [
                'coupure en cours',
                'panne signalée',
                'intervention en cours',
                'rétablir le courant',
                'délai de résolution'
            ],
            scheduled: [
                'travaux programmés',
                'coupure programmée',
                'interruption planifiée'
            ]
        };

        // Vérification des patterns
        if (patterns.hasOutage.some(p => pageText.includes(p))) {
            outageInfo.hasOutage = true;
            outageInfo.status = 'outage';
            outageInfo.message = 'Coupure d\'électricité en cours';
        } else if (patterns.scheduled.some(p => pageText.includes(p))) {
            outageInfo.hasOutage = true;
            outageInfo.status = 'scheduled';
            outageInfo.message = 'Travaux programmés sur le réseau';
        } else if (patterns.noOutage.some(p => pageText.includes(p))) {
            outageInfo.hasOutage = false;
            outageInfo.status = 'ok';
            outageInfo.message = 'Aucune coupure signalée';
        }

        // Extraction des éléments spécifiques (à adapter selon la structure HTML)
        $('.outage-item, .panne-info, .interruption-info').each((i, elem) => {
            const text = $(elem).text().trim();
            if (text) {
                outageInfo.details.push(text);
            }
        });

        // Recherche d'informations de temps/délai
        const timeMatch = pageText.match(/(\d{1,2}h\d{2})|(\d{1,2}:\d{2})/g);
        if (timeMatch) {
            outageInfo.estimatedTime = timeMatch;
        }

        // Si aucun pattern n'est détecté, analyse plus approfondie
        if (outageInfo.status === 'unknown') {
            const mainContent = $('.main-content, .content, .result').text();
            outageInfo.rawContent = mainContent.substring(0, 500); // Premiers 500 caractères
        }

    } catch (error) {
        console.error('Erreur extraction:', error.message);
        outageInfo.error = 'Erreur lors de l\'extraction des données';
    }

    return outageInfo;
}

/**
 * Route pour récupérer les départements
 * GET /api/departments
 */
app.get('/api/departments', (req, res) => {
    const departments = [];
    for (let i = 1; i <= 95; i++) {
        if (i === 20) continue; // Corse divisée
        departments.push({
            code: i.toString().padStart(2, '0'),
            emergencyNumber: `09 72 67 50 ${i.toString().padStart(2, '0')}`
        });
    }
    // Ajout Corse
    departments.push(
        { code: '2A', emergencyNumber: '09 72 67 50 2A' },
        { code: '2B', emergencyNumber: '09 72 67 50 2B' }
    );

    res.json({
        success: true,
        count: departments.length,
        departments: departments
    });
});

/**
 * Gestion des erreurs 404
 */
app.use((req, res) => {
    res.status(404).json({
        error: 'Route non trouvée',
        availableEndpoints: [
            'GET /',
            'GET /api/geocode/:city',
            'POST /api/outage',
            'GET /api/check/:city',
            'GET /api/departments'
        ]
    });
});

/**
 * Gestion des erreurs non capturées
 */
process.on('uncaughtException', (error) => {
    console.error('❌ Uncaught Exception:', error);
});

process.on('unhandledRejection', (error) => {
    console.error('❌ Unhandled Rejection:', error);
});

/**
 * Démarrage du serveur
 */
const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`
╔═══════════════════════════════════════════════════╗
║   🚀 Backend API Enedis - Démarré avec succès    ║
╠═══════════════════════════════════════════════════╣
║   Port: ${PORT}                                   ║
║   Environment: ${process.env.NODE_ENV || 'development'} ║
║   Node version: ${process.version}                ║
╠═══════════════════════════════════════════════════╣
║   Endpoints disponibles:                          ║
║   • GET  /                                        ║
║   • GET  /api/geocode/:city                       ║
║   • POST /api/outage                              ║
║   • GET  /api/check/:city                         ║
║   • GET  /api/departments                         ║
╚═══════════════════════════════════════════════════╝
    `);
});

/**
 * Gestion de l'arrêt gracieux
 */
const gracefulShutdown = () => {
    console.log('⚠️  Arrêt gracieux du serveur...');
    server.close(() => {
        console.log('✅ Serveur arrêté proprement');
        process.exit(0);
    });
    
    // Force l'arrêt après 10 secondes
    setTimeout(() => {
        console.error('⚠️  Forçage de l\'arrêt...');
        process.exit(1);
    }, 10000);
};

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

module.exports = app;
