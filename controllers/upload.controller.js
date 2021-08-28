//jshint esversion:6

// notre controlleur pour upload une image toute seulement


const  UserModel = require('../models/user.model');
const fs = require('fs');
const { promisify } = require('util');
const pipeline = promisify(require('stream').pipeline);
const { uploadErrors } = require('../utils/errors.utils');

module.exports.uploadProfil = async (req, res) => {
    try {
        if (req.file.detectedMimeType !== "image/jpg" && 
            req.file.detectedMimeType !== "image/jpeg" && 
            req.file.detectedMimeType !== "image/png"
        )
            throw Error("Invalid file");
        
        if (req.file.size > 500000) throw Error("max size"); 
    } catch (err) {
        const errors = uploadErrors(err);
        return res.status(201).json({ errors });
    }

    //si on passe ces conditions
    // son image sera son nom + jpg, chaque pseudo est unique donc toutes les photo seront unique
    // et evite le surstockage
    const fileName = req.body.name + ".jpg";

    // pipeline function qui gere tout ca
    await pipeline(
        req.file.stream,
        fs.createWriteStream(
            `${__dirname}/../client/public/uploads/profil/${fileName}`
        )
    );

    // maintenant on mes a mongoDB le chemin
    try {
        await UserModel.findByIdAndUpdate(
            req.body.userId,
            {$set: {picture: "./uploads/profil/" + fileName}},
            { new:true, upsert:true, setDefaultsOnInsert: true},
            (err, docs) => {
                if (!err) return res.send(docs);
                else return res.status(500).send({ message: err });
            }
        );
    } catch (err) {
        return res.status(500).send({ message: err });
    }
};