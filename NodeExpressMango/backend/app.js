/* Importation du module (package) express de node */
const express = require('express');
/* Importation du module (package) mongoose */
const mongoose = require('mongoose');

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
    console.log(req.body);
    res.status(201).json({
      message: 'Objet créé !'
    });
});

    // On change use en get pour intercepter uniquement les requête get
app.get('/api/stuff', (req, res, next) => { // le 1er string en paramètre est la route (=endpoint) pour laquelle nous souhaitons enregistrer ce middleware, elle complète l'url
    const stuff = [
        {
            _id: 'oeihfzeoi',
            title: 'Mon premier objet',
            description: 'Les infos de mon premier objet',
            imageUrl: 'https://cdn.pixabay.com/photo/2019/06/11/18/56/camera-4267692_1280.jpg',
            price: 4900,
            userId: 'qsomihvqios',
        },
        {
            _id: 'oeihfzeomoihi',
            title: 'Mon deuxième objet',
            description: 'Les infos de mon deuxième objet',
            imageUrl: 'https://cdn.pixabay.com/photo/2019/06/11/18/56/camera-4267692_1280.jpg',
            price: 2900,
            userId: 'qsomihvqios',
        },
    ];
    // Nous envoyons ces articles sous la forme de données JSON, avec un code 200 pour une demande réussie
    res.status(200).json(stuff);
});

/* exportation de cette application pour y accéder depuis les autres fichiers de notre projet (exemple : node)*/
module.exports = app;