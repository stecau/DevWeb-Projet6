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

/* Création d'un objet de configuration pour multer (méthode diskStorage) */
const storage = multer.diskStorage({
    // Fonction de destination (attribut = la requête req, le fichier file et callback)
    destination: (req, file, callback) => {
        callback(null, 'images') // null = pas d'erreur possible jusque là ; et images pour le nom du dossier
    },
    // Fonction définisant le nom de fichier (attribut = la requête req, le fichier file et callback)
    filename: (req, file, callback) => {
        const name = file.originalname.split(' ').join('_');
        const extension = MINE_TYPES[file.mimetype];
        callback(null, name + Date.now() + '.' + extension);
    }
});

/* Export de la méthode multer avec objet 'storage' et un fichier image unique (méthode single de type image) */
module.exports = multer({ storage }).single('image');