//jshint esversion:6
// inscription connexion et deconnexion

const UserModel = require('../models/user.model');
const { signUpErrors, signInErrors } = require('../utils/errors.utils');
const jwt = require('jsonwebtoken');
const maxAge = 3*24*60*60*1000;

const createToken = (id) => {
    //expiresIn cest le nbre de jour ou le token est valide(1 jour)
    //jwt prend le id + cle secrete, fait un mix
    return jwt.sign({id}, process.env.TOKEN_SECRET, {expiresIn: maxAge});
};

module.exports.signUp = async (req, res) => {
    //destructure (req.body.pseudo, req.body.email,...)
    const { pseudo, email, password } = req.body;
    try {
        //ce qu'on retrouve en reponse sur postman
        const user = await UserModel.create({pseudo, email, password});
        res.status(201).json({ user: user._id });
    } catch (err) {
        const errors = signUpErrors(err);
        res.status(200).send({ errors });
    }
};

module.exports.signIn = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await UserModel.login(email, password);
        const token = createToken(user._id);
        //creer cookie appele jwt avec token et la duree
        res.cookie('jwt', token, { httpOnly:true, maxAge });
        res.status(200).json({user:user._id});
    } catch (err) {
        const errors = signInErrors(err);
        res.status(200).json({ errors});
    }
};

module.exports.logout = function(req, res) {
    // on supprime le cookie tout simplement en 1 milliseconde
    res.cookie('jwt', '', { maxAge: 1 });
    res.redirect('/');
};