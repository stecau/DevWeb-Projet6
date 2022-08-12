/* Importation du module (package) http de node */
// require = commande pour importer un package
const http = require('http');

/* Création d'un serveur node avec la méthode 'createServer' qui prends comme argument :
    une fonction qui a comme paramètre une requête 'req' et une réponse 'res'
    Cette fonction sera systématiquement appelée lors de requête sur le serveur */
// Ce serveur créé est un objet qui permettra d'écouter les requêtes faites en http
const server = http.createServer((req, res) => {
    // Envoi systématiquement une réponse
    res.end('Voilà la réponse du serveur !');
});

/* Lancement (= écoiter, attendre les requête) du serveur avec la méthode 'listen' qui prend comme argument le port à écouter */
// process.end.PORT est une variable d'ebvironnementpour le port
server.listen(process.env.PORT || 3000);