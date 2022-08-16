/*--------------------------------------------------------------------------------*/
/* Création de notre module (package) 'Thing' modèle d'objets de la db mongoose : */
/*--------------------------------------------------------------------------------*/

/* Importation du module (package) mongoose */
const mongoose = require('mongoose');

/* Définition du schéma mongoose qui utilise des objets {} */
    /* nous créons un schéma de données qui contient les champs souhaités pour chaque Thing,
    indique leur type ainsi que leur caractère (obligatoire ou non).
    Pour cela, on utilise la méthode Schema mise à disposition par Mongoose.
    Pas besoin de mettre un champ pour l'Id puisqu'il est automatiquement généré par Mongoose */
const thingSchema = mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    imageUrl: { type: String, required: true },
    userId: { type: String, required: true },
    price: { type: Number, required: true },
});
  
/* Exportation du modèle de Thing basé sur le schéma mongoose */
    /* ensuite, nous exportons ce schéma en tant que modèle Mongoose appelé « Thing »,
    le rendant par là même disponible pour notre application Express */
module.exports = mongoose.model('Thing', thingSchema);