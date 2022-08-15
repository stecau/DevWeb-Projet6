/*--------------------------------------------------------------------------------*/
/* Création de notre module (package) 'router' de routes pour notre application : */
/*--------------------------------------------------------------------------------*/

/* Importation du module (package) express de node */
const express = require('express');
/* Déclaration d'un router pour toutes nos routes de l'app */
const router = express.Router();

/* Importation de notre controleur pour nos routes de l'app */
const stuffCtrl = require('../controllers/stuff');

/* Création de la requête Post (création) d'un objet 'thing' */
/* Express prend toutes les requêtes qui ont comme Content-Type application/json et 
met à disposition leur body directement sur l'objet req, ce qui nous permet d'écrire le middleware POST suivant : */
router.post('/', stuffCtrl.createThing);

// Rajout d'une requête Put (modification) sur un objet avec son id
router.put('/:id', stuffCtrl.modifyThing);

// Rajout d'une requête d'effacement d'un objet avec son id
router.delete('/:id', stuffCtrl.deleteThing);

// Rajout d'une requête Get sur un objet avec son id
    // :id permet d'avoir une requête dynamique et de capturer l'id de la requête dans les params (partie jsute après les :)
router.get('/:id', stuffCtrl.getOneThing);

// Rajout d'une requête Get sur la totalité des objets 'thing'
    // On change use en get pour intercepter uniquement les requête get
router.get('/', stuffCtrl.getAllThings);

/* Exportation de notre router express */
module.exports = router