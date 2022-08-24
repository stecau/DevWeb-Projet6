/*--------------------------------------------------------------------------------*/
/* Création de notre module (package) 'router' de routes sauce pour notre application : */
/*--------------------------------------------------------------------------------*/

/* Importation du module (package) express de node */
const express = require('express');
/* Déclaration d'un router pour toutes nos routes de l'app */
const router = express.Router();

/* Importation de notre authentificateur pour nos routes de l'app */
const auth = require('../middleware/auth');
/* Importation de notre multer pour nos routes de l'app */
const multer = require('../middleware/multer-config');

/* Importation de notre controleur pour nos routes de l'app */
const sauceCtrl = require('../controllers/sauce');

/* Création de la requête Post (création) d'un objet 'sauce' */
router.post('/', auth, multer, sauceCtrl.createSauce);

/* Création de la requête Post (création) d'un like sur une sauce */
router.post('/:id/like', auth, sauceCtrl.likeSauce);

// Rajout d'une requête Put (modification) sur un objet avec son id
router.put('/:id', auth, multer, sauceCtrl.modifySauce);

// Rajout d'une requête d'effacement d'un objet avec son id
router.delete('/:id', auth, sauceCtrl.deleteSauce);

// Rajout d'une requête Get sur un objet avec son id
router.get('/:id', auth, sauceCtrl.getOneSauce);

// Rajout d'une requête Get sur la totalité des objets 'sauce'
router.get('/', auth, sauceCtrl.getAllSauces);

/* Exportation de notre router express */
module.exports = router;