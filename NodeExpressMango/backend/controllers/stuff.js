/*-------------------------------------------------------------------------------------*/
/* Création de notre module (package) de 'controleur (logique métier)' de nos routes : */
/*-------------------------------------------------------------------------------------*/

/* Importation du modèle mongoose 'Thing' */
const Thing = require('../models/Thing');

/* Création de la requête Post (création) d'un objet 'thing' */
    /* Grâce à la méthode use de Express sur notre app et la déclaration des entêtes dans app.js,
    Express prend toutes les requêtes qui ont comme Content-Type application/json et 
    met à disposition leur body directement sur l'objet req, ce qui nous permet d'écrire le middleware POST suivant : */
exports.createThing = (req, res, next) => {
    // Création de l'objet requête qui est au format texte json car contient une image éventuellement
    const thingObject = JSON.parse(req.body.thing)
    // Création d'une instance 'thing' de notre modèle mongoose d'objet 'Thing'
        // Avant cela on retire le champs ID du formulaire frontend car on utilisera celui de la DB mongo
    delete thingObject._id;
        // On en fait jamais confiance au client donc on supprime également le userId
    delete thingObject.userId;
    const thing = new Thing({
        // Utilisation de l'opérateur 'spread' ... équivalant à 'title: req.body.title, ...'
        ...thingObject,
        userId: req.auth.userId,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}` // Création de l'url du fichier
    });
    // On enregistre dans le base de donnée
        // La méthode save de mongoose fait une promesse
    thing.save()
        // Quand tout se passe bien, il faut biensur renvoyer une réponse à la requete de création d'un objet (code 201)
        .then(() => res.status(201).json({ message: 'Objet enregistré !' }))
        // Avec catch, on capture l'error et on la transmet en réponse de la requête avec le code 400
        .catch(error => res.status(400).json({ error }));
};

// Rajout d'une requête Put (modification) sur un objet avec son id
exports.modifyThing = (req, res, next) => { // id en param de la req avec les :
    // Si fichier ou pas (un champs file est présent ou pas)
    const thingObjet = req.file ? { // si champs file alors req sous forme de texte que l'on convertie en objet
        ...JSON.parse(req.body.thing),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };
    // Mesure de sécurité, on supprime le userID de l'objet
    delete thingObjet._userId;
    // Mesure de sécurité également en cherchant l'objet dans la base et en vérifiant que l'utilisateur à les droits de modification
    Thing.findOne({_id: req.params.id}) // Méthode de mongoose de l'objet Thing pour trouver un objet dans la db avec promesse
        .then((thing => {
            if (thing.userId != req.auth.userId) { // ce n'est pas le même utilisateur
                res.status(401).json({ message: 'Non-autorisé' })
            } else {
                // utilisation de la méthode 'updateOne' de l'objet mongoose Thing
                // Elle prend en paramètre l'objet de comparaison ici sur id et en second paramètre l'objet modifié
                // Attention sur l'id, bien utilisé l'id de la databse car immuable donc si modifier renverra une erreur
                // Elle renvoie une promesse
                Thing.updateOne({ _id: req.params.id }, { ...thingObjet, _id: req.params.id })
                    .then(() => res.status(200).json({ message: 'Objet modifié !'})) // tout va bien
                    .catch(error => res.status(401).json({ error })); // gestion des erreurs
            };
        }))
        .catch(error => res.status(400).json({ error }));
};

// Rajout d'une requête d'effacement d'un objet avec son id
exports.deleteThing = (req, res, next) => {
    // Utilisation de la méthode 'deleteOne'
    Thing.deleteOne({ _id: req.params.id })
      .then(() => res.status(200).json({ message: 'Objet supprimé !'}))
      .catch(error => res.status(400).json({ error }));
};

// Rajout d'une requête Get sur un objet avec son id
    // :id permet d'avoir une requête dynamique et de capturer l'id de la requête dans les params (partie jsute après les :)
exports.getOneThing = (req, res, next) => {
    // Méthode de l'objet Thing mongoose pour récupérer une seule instance par son id
        // req.params.id pour récupérer l'id de la requête qui est comparé aux _id de la database
    Thing.findOne({ _id: req.params.id }) // renvoie l'objet dans une promesse
        // L'objet est trouvé, on renvoie le code 200 avezc l'objet également en réponse
        .then(thing => res.status(200).json(thing))
        // L'objet n'est pas trouvé, on renvoie l'erreur d'objet non trouvé (code 404)
        .catch(error => res.status(404).json({ error }));
};

// Rajout d'une requête Get sur la totalité des objets 'thing'
    // On change use en get pour intercepter uniquement les requête get
exports.getAllThings = (req, res, next) => { // le 1er string en paramètre est la route (=endpoint) pour laquelle nous souhaitons enregistrer ce middleware, elle complète l'url
    // nous utilisons la méthode find() dans notre modèle Mongoose afin de renvoyer un tableau contenant tous les Things dans notre base de données
        // elle renvoie une promesse
    Thing.find()
        // Si tout va bien, on renvoie le status 200 et la liste des objet de la database comme réponse à la requête
        .then(things => res.status(200).json(things))
        // Si erreur, on attrappe l'erreur et on la renvoie comme réponse à la requête avec code erreur 400
        .catch(error => res.status(400).json({ error }));
};