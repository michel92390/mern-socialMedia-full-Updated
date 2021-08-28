//jshint esversion:6
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const userRoutes = require('./routes/user.routes');
const postRoutes = require('./routes/post.routes');
require('dotenv').config({path: './config/.env'});
require('./config/db');
const { checkUser, requireAuth } = require('./middleware/auth.middleware');

//pour autoriser les requetes exterieur
const cors = require('cors');


const app = express();

// autoriser les requetes que l'ont veut dans une variable
const corsOptions = {
    origin: process.env.CLIENT_URL,
    credentials: true,
    'allowedHeaders': ['sessionId', 'Content-type'],
    'exposedHeaders': ['sessionId'],
    'methods': 'GET, HEAD, PUT, PATCH, POST, DELETE',
    'preflightContinue': false
};
app.use(cors(corsOptions));
// app.use(
//     cors({
//         origin: (origin, callback) => callback(null, true),
//         credentials: true,
//     })
// );


// traiter les requetes
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

//jwt
//etoile signifie a chaque requete de page, il verifie avec la function checkUser
app.get('*', checkUser);
app.get('/jwtid', requireAuth, (req, res) => {
    res.status(200).send(res.locals.user._id);
});

//routes
app.use('/api/user', userRoutes);
app.use('/api/post', postRoutes);

app.listen(process.env.PORT, () => {
    console.log(`Listening on port ${process.env.PORT}`);
});