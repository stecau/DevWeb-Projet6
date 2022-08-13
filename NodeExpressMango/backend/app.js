/* Importation du module (package) express de node */
const express = require('express');
/* Importation du module (package) mongoose */
const mongoose = require('mongoose');

/* Importation du modèle mongoose 'Thing' */
const Thing = require('./models/Thing');

/* Création de notre application express 'app' */
const app = express();

/* Connexion à la database mongodb Atlas */
mongoose.connect('mongodb+srv://Stecau:Stecau396909@clusterstecau.rlrnod6.mongodb.net/?retryWrites=true&w=majority',
    { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));

/* Pour gérer la requête POST venant de l'application front-end,
on a besoin d'en extraire le corps JSON.
Pour cela, vous avez juste besoin d'un middleware très simple,
mis à disposition par le framework Express.
Juste après la déclaration de la constante  app  , ajoutez : */
app.use(express.json());

/* Création de la fonction de requête par la méthode use de express */
    /* Une application Express est fondamentalement une série de fonctions appelées middleware [app.use()].
    Chaque élément de middleware reçoit les objets request et response, peut les lire, les analyser et les manipuler, le cas échéant.
    Le middleware Express reçoit également la méthode next, qui permet à chaque middleware de passer l'exécution au middleware suivant. */

    // 1ère étape, rajout des headers pour éviter les problème de CORS
    /* Erreurs de CORS : CORS signifie « Cross Origin Resource Sharing ».
    Il s'agit d'un système de sécurité qui, par défaut, bloque les appels HTTP entre des serveurs différents,
    ce qui empêche donc les requêtes malveillantes d'accéder à des ressources sensibles.
    Dans notre cas, nous avons deux origines : localhost:3000 et localhost:4200,
    et nous souhaiterions qu'elles puissent communiquer entre elles.
    Pour cela, nous devons ajouter des headers à notre objet  response . */
app.use((req, res, next) => {
    // accéder à notre API depuis n'importe quelle origine ( '*' )
    res.setHeader('Access-Control-Allow-Origin', '*');
    // ajouter les headers mentionnés aux requêtes envoyées vers notre API (Origin , X-Requested-With , etc.)
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    // envoyer des requêtes avec les méthodes mentionnées ( GET ,POST , etc.)
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

/* Express prend toutes les requêtes qui ont comme Content-Type application/json et 
met à disposition leur body directement sur l'objet req, ce qui nous permet d'écrire le middleware POST suivant : */
app.post('/api/stuff', (req, res, next) => {
    // Création d'une instance 'thing' de notre modèle mongoose d'objet 'Thing'
        // Avant cela on retire le champs ID du formulaire frontend car on utilisera celui de la DB mongo
    delete req.body._id;
    const thing = new Thing({
        // Utilisation de l'opérateur 'spread' ... équivalant à 'title: req.body.title, ...'
        ...req.body
    });
    // On enregistre dans le base de donnée
        // La méthode save de mongoose fait une promesse
    thing.save()
        // Quand tout se passe bien, il faut biensur renvoyer une réponse à la requete de création d'un objet (code 201)
        .then(() => res.status(201).json({ message: 'Objet enregistré !' }))
        // Avec catch, on capture l'error et on la transmet en réponse de la requête avec le code 400
        .catch(error => res.status(400).json({ error }));
});

// Rajout d'une requête Get sur un objet avec son id
    // :id permet d'avoir une requête dynamique et de capturer l'id de la requête dans les params (partie jsute après les :)
app.get('/api/stuff/:id', (req, res, next) => {
    // Méthode de l'objet Thing mongoose pour récupérer une seule instance par son id
        // req.params.id pour récupérer l'id de la requête qui est comparé aux _id de la database
    Thing.findOne({ _id: req.params.id }) // renvoie l'objet dans une promesse
        // L'objet est trouvé, on renvoie le code 200 avezc l'objet également en réponse
        .then(thing => res.status(200).json(thing))
        // L'objet n'est pas trouvé, on renvoie l'erreur d'objet non trouvé (code 404)
        .catch(error => res.status(404).json({ error }));
  });

    // On change use en get pour intercepter uniquement les requête get
app.get('/api/stuff', (req, res, next) => { // le 1er string en paramètre est la route (=endpoint) pour laquelle nous souhaitons enregistrer ce middleware, elle complète l'url
    // nous utilisons la méthode find() dans notre modèle Mongoose afin de renvoyer un tableau contenant tous les Things dans notre base de données
        // elle renvoie une promesse
    Thing.find()
        // Si tout va bien, on renvoie le status 200 et la liste des objet de la database comme réponse à la requête
        .then(things => res.status(200).json(things))
        // Si erreur, on attrappe l'erreur et on la renvoie comme réponse à la requête avec code erreur 400
        .catch(error => res.status(400).json({ error }));
});

/* exportation de cette application pour y accéder depuis les autres fichiers de notre projet (exemple : node)*/
module.exports = app;