/*------------------------------------------------------------------------------*/
/* Création de notre module (package) 'auth' pour le middleware de vérification */          
/*                     de connection de l'utilisateur (token)                   */
/*------------------------------------------------------------------------------*/

/* Importation du module (package) jsonwebtoken */
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    // récupération du token ('bearer token')
    try {
        const token = req.headers.authorization.split(' ')[1]; // récupération du token dans le header de la request
        const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET'); // décodage du token récupéré avec la clé secrète d'encodage
        const userId = decodedToken.userId; // récupération du userId de l'objet decodedToken avec la key de l'objet 'userId'
        // Rajout d'un objet d'authentification dans l'entête de la requête
        req.auth = {
            userId: userId
        };
        next(); // pour continuer la route (routage)
    } catch(error) {
        //res.status(401).json({ error });
        res.status(401).json({ error });
    };
};