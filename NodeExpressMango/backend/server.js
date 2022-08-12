/* Importation du module (package) http de node */
// require = commande pour importer un package
const http = require('http');

/* Création d'un serveur node avec la méthode 'createServer' qui prends comme argument :
    une fonction qui a comme paramètre une requête 'req' et une réponse 'res'
    Cette fonction sera systématiquement appelée lors de requête sur le serveur */
// Ce serveur créé est un objet qui permettra d'écouter les requêtes faites en http
    /*const server = http.createServer((req, res) => {
        // Envoi systématiquement une réponse
        res.end('Voilà la réponse du serveur !');
    });*/

/* Importation de notre application express 'app' */
const app = require('./app');

/* Création d'un serveur node avec la méthode 'createServer' qui prends comme argument :
    une fonction qui a comme paramètre une requête 'req' et une réponse 'res'
    Cette fonction sera systématiquement appelée lors de requête sur le serveur 
    Ici c'est notre application express car express renvoie un fonction avec la requête et la réponse en paramètre */
// Ce serveur créé est un objet qui permettra d'écouter les requêtes faites en http
/* Attention, il faut définir le port que l'application va utiliser */
    // Fonction normalizePort qui renvoie un port valide, qu'il soit fourni sous la forme d'un numéro ou d'une chaîne
const normalizePort = val => {
    const port = parseInt(val, 10);
  
    if (isNaN(port)) {
        return val;
    }
    if (port >= 0) {
        return port;
    }
    return false;
};
    // Définition du port
        // process.end.PORT est une variable d'environnement pour le port
const port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

    // Fonction errorHandler qui recherche les différentes erreurs et les gère de manière appropriée. Elle est ensuite enregistrée dans le serveur
const errorHandler = error => {
    if (error.syscall !== 'listen') {
        throw error;
    };
    const address = server.address();
    const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port;
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges.');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use.');
            process.exit(1);
            break;
        default:
            throw error;
    };
};

/* Création du serveur */
const server = http.createServer(app);
    // un écouteur des erreur avec la fonction errorHandler
server.on('error', errorHandler);
    // un écouteur d'évènements est également enregistré, consignant le port ou le canal nommé sur lequel le serveur s'exécute dans la console
server.on('listening', () => {
    const address = server.address();
    const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
    console.log('Listening on ' + bind);
});

/* Lancement (= écoiter, attendre les requête) du serveur avec la méthode 'listen' qui prend comme argument le port à écouter */
server.listen(port);