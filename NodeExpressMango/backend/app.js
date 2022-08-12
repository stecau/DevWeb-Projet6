/* Importation du module (package) express de node */
const express = require('express');

/* Création de notre application express 'app' */
const app = express();

/* Création de la fonction de requête par la méthode use de express */
    /* Une application Express est fondamentalement une série de fonctions appelées middleware [app.use()].
    Chaque élément de middleware reçoit les objets request et response, peut les lire, les analyser et les manipuler, le cas échéant.
    Le middleware Express reçoit également la méthode next, qui permet à chaque middleware de passer l'exécution au middleware suivant. */
app.use((req, res, next) => { // 1er middleware avec un console log
    console.log('Requête reçue !');
    next();
});

app.use((req, res, next) => { // 2ème middleware, on change le status de la réponse de 200 à 201
    res.status(201);
    next();
});
  
app.use((req, res, next) => { // 3ème middleware, on envoie la réponse
    res.json({ message: 'Votre requête a bien été reçue !' });
    next();
});
  
app.use((req, res, next) => { // 4ème middleware, on affiche que la réponse a bien été envoyée avec un console log
    console.log('Réponse envoyée avec succès !');
});

/* exportation de cette application pour y accéder depuis les autres fichiers de notre projet (exemple : node)*/
module.exports = app;