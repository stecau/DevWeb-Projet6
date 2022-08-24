/*-------------------------------------------------------------------------------------------*/
/* Création de notre module (package) de 'controleur (logique métier)' de nos routes sauce : */
/*-------------------------------------------------------------------------------------------*/

/* Importation du package fs (file system) pour la suppression de fichier */
const fs = require('fs');
/* Importation du modèle mongoose 'Sauce' */
const Sauce = require('../models/Sauce');

/* Création de la requête Post (création) d'un objet 'sauce' */
exports.createSauce = (req, res, next) => {
    // Création de l'objet requête qui est au format texte json car contient une image éventuellement
    const sauceObject = JSON.parse(req.body.sauce)
    // Création d'une instance 'sauce' de notre modèle mongoose d'objet 'Sauce'
    delete sauceObject._id; // Avant cela on retire le champs ID du formulaire frontend car on utilisera celui de la DB mongo
    delete sauceObject.userId; // On en fait jamais confiance au client donc on supprime également le userId
    // Initialisation comptage like(s) et dislike(s)
    sauceObject.likes = 0;
    sauceObject.dislikes = 0;
    sauceObject.usersLiked = [];
    sauceObject.usersDisliked = [];
    const sauce = new Sauce({
        ...sauceObject,
        userId: req.auth.userId,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}` // Création de l'url du fichier
    });
    // On enregistre dans le base de donnée
    sauce.save() // La méthode save de mongoose fait une promesse
        .then(() => res.status(201).json({ message: 'Objet enregistré !' }))
        .catch(error => res.status(400).json({ error }));
};

// Rajout d'une requête Put (modification) sur un objet avec son id
exports.modifySauce = (req, res, next) => {
    // Si fichier ou pas (un champs file est présent ou pas)
    const sauceObjet = req.file ? { // si champs file alors req sous forme de texte que l'on convertie en objet
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };
    // Mesure de sécurité, on supprime le userID de l'objet
    delete sauceObjet._userId;
    // Mesure de sécurité également en cherchant l'objet dans la base et en vérifiant que l'utilisateur à les droits de modification
    Sauce.findOne({_id: req.params.id}) // Méthode de mongoose de l'objet Sauce pour trouver un objet dans la db avec promesse
        .then((sauce => {
            if (sauce.userId != req.auth.userId) { // ce n'est pas le même utilisateur
                res.status(401).json({ message: 'Non-autorisé' })
            } else {
                // Si changement d'image, alors on supprime l'ancienne image du serveur
                suppressionServeurAncienneImage(sauce, sauceObjet);
                // utilisation de la méthode 'updateOne' de l'objet mongoose Sauce qui renvoie une promesse
                Sauce.updateOne({ _id: req.params.id }, { ...sauceObjet, _id: req.params.id })
                    .then(() => res.status(200).json({ message: 'Objet modifié !'})) // tout va bien
                    .catch(error => res.status(401).json({ error })); // gestion des erreurs
            };
        }))
        .catch(error => res.status(400).json({ error }));
};

// Rajout d'une requête d'effacement d'un objet avec son id
exports.deleteSauce = (req, res, next) => {
    // Utilisation de la méthode mongoose findOne (promesse)
    Sauce.findOne({ _id: req.params.id})
        .then(sauce => {
            if (sauce.userId != req.auth.userId) { // ce n'est pas le même utilisateur
                res.status(401).json({ message: 'Non-autorisé' })
            } else {
                // Suppression du fichier sur le serveur
                const filename = sauce.imageUrl.split('/images/')[1]; // récupération du nom du fichier dans le dossier 'images'
                // méthode de suppression de fichier avec fonction asynchrone
                fs.unlink(`images/${filename}`, () => {
                    // Utilisation de la méthode 'deleteOne' pour la suppression dans la base de données
                    Sauce.deleteOne({ _id: req.params.id })
                        .then(() => res.status(200).json({ message: 'Objet supprimé !'}))
                        .catch(error => res.status(400).json({ error }));
                });
            };
        })
        .catch(error => res.status(500).json({ error }));
};

// Rajout d'une requête Get sur un objet avec son id
exports.getOneSauce = (req, res, next) => {
    // Méthode de l'objet Sauce mongoose pour récupérer une seule instance par son id
    Sauce.findOne({ _id: req.params.id }) // renvoie l'objet dans une promesse
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(404).json({ error }));
};

// Rajout d'une requête Get sur la totalité des objets 'sauce'
exports.getAllSauces = (req, res, next) => { // le 1er string en paramètre est la route (=endpoint) pour laquelle nous souhaitons enregistrer ce middleware, elle complète l'url
    // nous utilisons la méthode find() dans notre modèle Mongoose afin de renvoyer un tableau contenant tous les Sauces dans notre base de données
    Sauce.find() // renvoie la liste des objets dans une promesse
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(400).json({ error }));
};

// Fonction de supression de l'ancienne image du serveur si modification de l'image d'une sauce
const suppressionServeurAncienneImage = (sauce, sauceObjet) => {
    if ('imageUrl' in sauceObjet) {
        if (sauceObjet.imageUrl != sauce.imageUrl) {
            // Suppression du fichier sur le serveur
            const filename = sauce.imageUrl.split('/images/')[1]; // récupération du nom du fichier dans le dossier 'images'
            // méthode de suppression de fichier avec fonction asynchrone
            fs.unlink(`images/${filename}`, (err) => {
                if (err) throw err;
                return `images/${filename} was deleted`;
            });
        };
    };
};