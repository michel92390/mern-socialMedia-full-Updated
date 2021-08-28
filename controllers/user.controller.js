//jshint esversion:8
const UserModel = require('../models/user.model');
const ObjectID = require('mongoose').Types.ObjectId;
//const { ObjectID } = require('bson');

module.exports.getAllUsers = async (req, res) => {
    //selectionne tous sauf le password dans(GET-postman)
    const users = await UserModel.find().select('-password');
    res.status(200).json(users);
};


//info uniquement de l'utilisateur et non tout le monde
module.exports.userInfo = (req, res) => {
    //correspond aux parametre que l'on a dans l'url
    //http://localhost:5000/api/user/:id
    console.log(req.params);
    if (!ObjectID.isValid(req.params.id)) 
        return res.status(400).send("ID unknown: " + req.params.id);

    UserModel.findById(req.params.id, (err, docs) => {
        if (!err) res.send(docs);
        else console.log("ID unknown: " + err);
    }).select('-password');
};

module.exports.updateUser = async (req, res) => {
    if (!ObjectID.isValid(req.params.id)) 
        return res.status(400).send("ID unknown: " + req.params.id);

    try {
        await UserModel.findOneAndUpdate(
            {_id: req.params.id},
            {
                $set: {
                    bio: req.body.bio
                }
            },
            { new: true, upsert: true, setDefaultsOnInsert: true},
            (err, docs) => {
                if (!err) return res.send(docs);
                if (err) return res.status(500).send({ message: err });
            }
        )
    }
    catch (err) {
        return res.status(500).json({ message: err });
    }
};

module.exports.deleteUser = async (req, res) => {
    if (!ObjectID.isValid(req.params.id)) 
        return res.status(400).send("ID unknown: " + req.params.id);
    
        try {
            await UserModel.remove({ _id: req.params.id }).exec();
            res.status(200).json({ message: "Successfully deleted"});
        } catch (err){
            return res.status(500).json({ message: err });
        }
};

module.exports.follow = async (req, res) => {
    if (!ObjectID.isValid(req.params.id) || !ObjectID.isValid(req.body.idToFollow)) 
        return res.status(400).send("ID unknown: " + req.params.id);

    try {
        //add to the follower list (personne que je suis)
        await UserModel.findByIdAndUpdate(
            //on prend ce id
            req.params.id,
            //et on lui rajoute ce following(personne que je suis)
            {$addToSet: { following: req.body.idToFollow }},
            {new:true, upsert:true},
            (err, docs) => {
                if (!err) res.status(201).json(docs);
                else return res.status(400).json(err);
            }
        );
        //add to following list(la personne qui est suivi)
        await UserModel.findByIdAndUpdate(
            //on select le id suivi
            req.body.idToFollow,
            //et on lui add celui qui le follow
            {$addToSet: { followers: req.params.id }},
            {new:true, upsert:true},
            (err, docs) => {
                //if (!err) res.status(201).json(docs);
                if (err) return res.status(400).json(err);
            }
        )
    } catch (err){
        return res.status(500).json({ message: err });
    }
};

//faire le chemin inverse de follow
module.exports.unfollow = async (req, res) => {
    if (!ObjectID.isValid(req.params.id) || !ObjectID.isValid(req.body.idToUnFollow)) 
        return res.status(400).send("ID unknown: " + req.params.id);

        try {
            //add to the follower list (personne que je suis)
            await UserModel.findByIdAndUpdate(
                //on prend ce id
                req.params.id,
                //et on lui rajoute ce following(personne que je suis)
                {$pull: { following: req.body.idToUnFollow }},
                {new:true, upsert:true},
                (err, docs) => {
                    if (!err) res.status(201).json(docs);
                    else return res.status(400).json(err);
                }
            );
            //add to following list(la personne qui est suivi)
            await UserModel.findByIdAndUpdate(
                //on select le id suivi
                req.body.idToUnFollow,
                //et on lui add celui qui le follow
                {$pull: { followers: req.params.id }},
                {new:true, upsert:true},
                (err, docs) => {
                    //if (!err) res.status(201).json(docs);
                    if (err) return res.status(400).json(err);
                }
            )
        } catch (err){
            return res.status(500).json({ message: err });
        }
};
