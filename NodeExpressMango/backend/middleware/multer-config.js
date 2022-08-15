/*--------------------------------------------------------------------------------*/
/* Création de notre module (package) 'multer-config' pour le middleware d'upload */          
/*                            d'image dans le serveur                             */
/*--------------------------------------------------------------------------------*/

/* Importation du module (package) multer */
const multer = require('multer');

/* Création d'un dictionnaire 'MINE_TYPES' */
const MINE_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png'
};

/* Création d'un objet de configuration pour multer */
// utilisation de la méthode diskStorage qui a besoin d'une fonction en destination
    // Cette fonction a pour attribut la requête 'req', le fichier 'file' et un callback
// et d'une fonction en filename qui fonctionne comme la première pour les paramètres
const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'images') // null pour dire qu'il n'y pas d'erreur possible jusque là ; et images pour le nom du dossier
    },
    filename: (req, file, callback) => { // Explique a multer quel nom de fichier utiliser
        const name = file.originalname.split(' ').join('_'); // Récupère le nom du fichier original (initial) avec remplacement des espace par '_'
        const extension = MINE_TYPES[file.mimetype]; // Récupère l'extention du fichier original (initial) grace à son 'minetype'
        callback(null, name + Date.now() + '.' + extension); // Crée un nom de fichier en rajoutant la date à la milliseconde près pour le rendre unique
    }
});

module.exports = multer({ storage }).single('image'); // méthode multer à laquelle on passe notre objet 'storage' et dire que le fichier est unique avec la méthode single de type image
