// test-api.js - Script de test pour l'API

const axios = require('axios');

const API_URL = 'http://localhost:3000';

// Couleurs pour l'affichage console
const colors = {
    reset: '\x1b[0m',
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    blue: '\x1b[36m'
};

function log(message, color = 'reset') {
    console.log(`${colors[color]}${message}${colors.reset}`);
}

async function testAPI() {
    log('\n╔═══════════════════════════════════════╗', 'blue');
    log('║     Test de l\'API Enedis Coupure    ║', 'blue');
    log('╚═══════════════════════════════════════╝\n', 'blue');

    // Test 1: Route principale
    log('📋 Test 1: Route principale (/)', 'yellow');
    try {
        const response = await axios.get(`${API_URL}/`);
        log('✅ Succès - Serveur opérationnel', 'green');
        console.log(JSON.stringify(response.data, null, 2));
    } catch (error) {
        log(`❌ Échec: ${error.message}`, 'red');
    }

    // Test 2: Géocodage
    log('\n📋 Test 2: Géocodage d\'une ville (Lyon)', 'yellow');
    try {
        const response = await axios.get(`${API_URL}/api/geocode/Lyon`);
        log('✅ Succès - Ville géocodée', 'green');
        console.log(JSON.stringify(response.data, null, 2));
    } catch (error) {
        log(`❌ Échec: ${error.message}`, 'red');
    }

    // Test 3: Vérification complète
    log('\n📋 Test 3: Vérification complète (Saint-Priest)', 'yellow');
    try {
        const response = await axios.get(`${API_URL}/api/check/Saint-Priest`);
        log('✅ Succès - Données récupérées', 'green');
        console.log(JSON.stringify(response.data, null, 2));
    } catch (error) {
        log(`❌ Échec: ${error.message}`, 'red');
    }

    // Test 4: Vérification des coupures (POST)
    log('\n📋 Test 4: Vérification des coupures (POST)', 'yellow');
    try {
        const response = await axios.post(`${API_URL}/api/outage`, {
            city: 'Lyon',
            insee: '69123',
            latitude: 45.764043,
            longitude: 4.835659,
            department: '69',
            postcode: '69000'
        });
        log('✅ Succès - Informations de coupure récupérées', 'green');
        console.log(JSON.stringify(response.data, null, 2));
    } catch (error) {
        log(`❌ Échec: ${error.message}`, 'red');
    }

    // Test 5: Liste des départements
    log('\n📋 Test 5: Liste des départements', 'yellow');
    try {
        const response = await axios.get(`${API_URL}/api/departments`);
        log(`✅ Succès - ${response.data.count} départements récupérés`, 'green');
        console.log('Premiers départements:', response.data.departments.slice(0, 5));
    } catch (error) {
        log(`❌ Échec: ${error.message}`, 'red');
    }

    // Test 6: Ville inexistante
    log('\n📋 Test 6: Ville inexistante', 'yellow');
    try {
        const response = await axios.get(`${API_URL}/api/geocode/VilleQuiNexistePas`);
        log('❌ Ce test devrait échouer', 'red');
    } catch (error) {
        if (error.response && error.response.status === 404) {
            log('✅ Succès - Erreur 404 correctement retournée', 'green');
            console.log(error.response.data);
        } else {
            log(`❌ Échec: ${error.message}`, 'red');
        }
    }

    log('\n╔═══════════════════════════════════════╗', 'blue');
    log('║         Tests terminés               ║', 'blue');
    log('╚═══════════════════════════════════════╝\n', 'blue');
}

// Exécution des tests
testAPI().catch(error => {
    log(`\n❌ Erreur fatale: ${error.message}`, 'red');
    log('\n💡 Assurez-vous que le serveur est démarré avec: npm start', 'yellow');
    process.exit(1);
});
