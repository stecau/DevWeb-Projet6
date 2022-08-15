/*--------------------------------------------------------------------------------------------------*/
/* Création de notre module (package) de 'controleur (logique métier)' de nos routes utilisateurs : */
/*--------------------------------------------------------------------------------------------------*/

/* Importation du module (package) bcrypt pour crypter les mots de passe */
const bcrypt = require('bcrypt');

/* Importation de notre modèle mongoose 'User' */
const User = require('../models/User');


/* Création de la requête Post (création) d'un objet 'user' */
exports.signup = (req, res, next) => {
    // Hashage du mot de passe (Attention : fonction asynchrone)
    bcrypt.hash(req.body.password, 10) // Bouclage 10 fois sur l'algo de cryptage
        .then(hash => { // Hashage fini et ok, on crée notre utilisateur
            // Création d'une instance 'user' de notre modèle mongoose d'objet 'User'
            const user = new User({
                email: req.body.email,
                password: hash
            });
            // On enregistre dans le base de donnée
            user.save() // Attention utilisation des promesses par la méthode save de mongoose
                // Quand tout se passe bien, il faut biensur renvoyer une réponse à la requete de création d'un objet (code 201)
                .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
                // Avec catch, on capture l'error et on la transmet en réponse de la requête avec le code 400
                .catch(error => res.status(400).json({ error }));
        })
        .catch(error => res.status(500).json({ error })); // erreur code 500 pour une erreur serveur
};

/* Création de la requête Get (connexion) d'un objet 'user' */
exports.login = (req, res, next) => {
    
};

