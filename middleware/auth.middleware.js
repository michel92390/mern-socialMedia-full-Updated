//jshint esversion:6
const jwt = require('jsonwebtoken');
const UserModel = require('../models/user.model');


//pour tester si lutilisateur est connecter a chaque fois
module.exports.checkUser = (req,res, next) => {
    //pour lire le cookie
    const token = req.cookies.jwt;
    if (token) {
        jwt.verify(token, process.env.TOKEN_SECRET, async (err, decodedToken) => {
            if (err) {
                //si ontrouve 1 erreur dans ce decodage
                //supprime le user
                res.locals.user = null;
                // onlui enleve
                //res.cookie('jwt', '', { maxAge:1 });
                //et on continue a bosser
                next();
            } else {
                let user = await UserModel.findById(decodedToken.id);
                res.locals.user = user;
                next();
            }
        });
    // if no token
    } else {
        res.locals.user = null;
        next();
    }
};


//middleware pour la 1ere demande d'authentification
module.exports.requireAuth = (req, res, next) => {
    const token = req.cookies.jwt;

    if (token) {
        jwt.verify(token, process.env.TOKEN_SECRET, async (err, decodedToken) => {
            if (err) {
                console.log(err);
            } else {
                //si il fonctionne, cela veut dire que l'on a reussi a logger le user
                console.log(decodedToken.id);
                next();
            }
        });
    // if no token
    } else {
        console.log("No token");
    }
};