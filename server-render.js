// Backend Node.js pour l'API Enedis - Optimisé pour Render.com
// Déploiement : https://render.com

const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 3001; // Render utilise une variable d'environnement PORT

// Configuration CORS pour autoriser les requêtes depuis n'importe quel domaine
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware pour parser le JSON
app.use(express.json());

// Route de santé pour Render (health check)
app.get('/health', (req, res) => {
    res.status(200).json({ 
        status: 'ok', 
        service: 'Enedis API Backend',
        timestamp: new Date().toISOString()
    });
});

// Route principale
app.get('/', (req, res) => {
    res.send(`
        <html>
        <head>
            <title>⚡ API Enedis Backend - Render</title>
            <style>
                body { 
                    font-family: Arial, sans-serif; 
                    padding: 40px; 
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                }
                .container { 
                    max-width: 800px; 
                    margin: 0 auto; 
                    background: white; 
                    padding: 30px; 
                    border-radius: 15px;
                    color: #333;
                    box-shadow: 0 10px 40px rgba(0,0,0,0.3);
                }
                h1 { color: #667eea; text-align: center; }
                .status { 
                    background: #e8f5e9; 
                    color: #2e7d32; 
                    padding: 15px; 
                    border-radius: 8px; 
                    margin: 20px 0;
                    text-align: center;
                    font-weight: 600;
                }
                .endpoint { 
                    background: #e3f2fd; 
                    padding: 15px; 
                    border-radius: 8px; 
                    margin: 20px 0; 
                }
                code { 
                    background: #f5f5f5; 
                    padding: 5px 10px; 
                    border-radius: 3px;
                    font-family: monospace;
                }
                .test-btn { 
                    background: #667eea; 
                    color: white; 
                    padding: 12px 24px; 
                    border: none; 
                    border-radius: 8px; 
                    cursor: pointer; 
                    margin: 10px 5px;
                    font-size: 1em;
                    font-weight: 600;
                    transition: transform 0.2s;
                }
                .test-btn:hover { 
                    background: #5568d3;
                    transform: translateY(-2px);
                }
                pre { 
                    background: #f5f5f5; 
                    padding: 15px; 
                    border-radius: 8px; 
                    overflow-x: auto;
                    font-size: 0.9em;
                }
                .info { color: #666; font-size: 0.9em; margin-top: 10px; }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>⚡ Backend API Enedis</h1>
                <div class="status">
                    ✅ Serveur actif et opérationnel
                </div>
                
                <h3>📍 Endpoint disponible :</h3>
                <div class="endpoint">
                    <strong>GET</strong> <code>/api/enedis/:postalCode</code>
                    <p class="info">Récupère les interruptions électriques en cours pour un code postal</p>
                </div>
                
                <h3>🧪 Tests rapides :</h3>
                <button class="test-btn" onclick="test('29460')">⚠️ Test 29460 (avec panne)</button>
                <button class="test-btn" onclick="test('75001')">✅ Test 75001 (sans panne)</button>
                
                <h3>📋 Résultat :</h3>
                <pre id="result">Cliquez sur un bouton de test...</pre>
                
                <h3>💡 Utilisation depuis votre application :</h3>
                <div class="endpoint">
                    <code>https://votre-app.onrender.com/api/enedis/29460</code>
                    <p class="info">Remplacez "votre-app" par le nom de votre service Render</p>
                </div>
                
                <script>
                    async function test(postalCode) {
                        document.getElementById('result').textContent = '⏳ Chargement...';
                        try {
                            const response = await fetch('/api/enedis/' + postalCode);
                            const data = await response.json();
                            document.getElementById('result').textContent = JSON.stringify(data, null, 2);
                        } catch (error) {
                            document.getElementById('result').textContent = '❌ Erreur: ' + error.message;
                        }
                    }
                </script>
            </div>
        </body>
        </html>
    `);
});

// Route pour récupérer les interruptions par code postal
app.get('/api/enedis/:postalCode', async (req, res) => {
    try {
        const postalCode = req.params.postalCode;
        
        console.log(`📡 [${new Date().toISOString()}] Requête pour le code postal: ${postalCode}`);
        
        // Validation du code postal
        if (!/^\d{5}$/.test(postalCode)) {
            console.log(`❌ Code postal invalide: ${postalCode}`);
            return res.status(400).json({
                status: 'error',
                error: 'Code postal invalide',
                message: 'Le code postal doit contenir 5 chiffres'
            });
        }
        
        // URL de l'API Enedis avec filtre statut="En cours"
        const apiUrl = `https://data.enedis.fr/api/explore/v2.1/catalog/datasets/interruptions-de-courant/records?where=code_postal="${postalCode}" AND statut="En cours"&limit=20&order_by=date_et_heure_de_debut DESC`;
        
        console.log('🔍 Appel API Enedis...');
        
        const response = await fetch(apiUrl, {
            headers: {
                'Accept': 'application/json',
                'User-Agent': 'Enedis-Monitor/1.0'
            },
            timeout: 10000 // Timeout de 10 secondes
        });
        
        if (!response.ok) {
            throw new Error(`Erreur API Enedis: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        
        console.log(`✅ ${data.results ? data.results.length : 0} interruption(s) trouvée(s)`);
        
        // Transformer les données pour l'application
        const interruptions = data.results || [];
        
        if (interruptions.length === 0) {
            return res.json({
                status: 'ok',
                message: 'Aucune interruption en cours',
                interruptions: [],
                codePostal: postalCode,
                timestamp: new Date().toISOString()
            });
        }
        
        // Formater les interruptions
        const formattedInterruptions = interruptions.map(item => ({
            commune: item.commune,
            statut: item.statut,
            type: item.type_intervention,
            clientsTouches: item.nombre_clients_touches,
            dateDebut: item.date_et_heure_de_debut,
            dateFinPrevue: item.date_et_heure_de_fin_prevue,
            motif: item.motif_intervention,
            codePostal: item.code_postal
        }));
        
        console.log(`📊 Réponse envoyée avec ${formattedInterruptions.length} interruption(s)`);
        
        res.json({
            status: 'outage',
            message: `${interruptions.length} interruption(s) en cours`,
            interruptions: formattedInterruptions,
            codePostal: postalCode,
            timestamp: new Date().toISOString()
        });
        
    } catch (error) {
        console.error('❌ Erreur:', error.message);
        res.status(500).json({
            status: 'error',
            message: 'Erreur lors de la récupération des données',
            error: error.message,
            timestamp: new Date().toISOString()
        });
    }
});

// Middleware pour gérer les routes non trouvées
app.use((req, res) => {
    res.status(404).json({
        status: 'error',
        message: 'Route non trouvée',
        availableRoutes: [
            'GET /',
            'GET /health',
            'GET /api/enedis/:postalCode'
        ]
    });
});

// Démarrage du serveur
app.listen(PORT, '0.0.0.0', () => {
    console.log('\n╔═══════════════════════════════════════════════════════╗');
    console.log('║                                                       ║');
    console.log('║     ⚡ Backend API Enedis - Démarré sur Render  ⚡    ║');
    console.log('║                                                       ║');
    console.log('╚═══════════════════════════════════════════════════════╝\n');
    console.log(`✅ Serveur actif sur le port : ${PORT}`);
    console.log(`🌐 Environnement : ${process.env.NODE_ENV || 'development'}`);
    console.log(`📡 API disponible : /api/enedis/:postalCode`);
    console.log(`💚 Health check : /health\n`);
});

// Gestion gracieuse de l'arrêt
process.on('SIGTERM', () => {
    console.log('🛑 Signal SIGTERM reçu, arrêt gracieux...');
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('\n🛑 Signal SIGINT reçu, arrêt gracieux...');
    process.exit(0);
});
