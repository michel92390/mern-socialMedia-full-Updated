//jshint esversion:6
const  PostModel = require('../models/post.model');
const  UserModel = require('../models/user.model');
const fs = require('fs');
const { promisify } = require('util');
const pipeline = promisify(require('stream').pipeline);
const { uploadErrors } = require('../utils/errors.utils');

//verifier que le parametre passer existe dans la base de donnee
const ObjectID = require('mongoose').Types.ObjectId;


module.exports.readPost = (req, res) => {

    PostModel.find((err, docs) => {
        if (!err) res.send(docs);
        else console.log("Error to get data " + err);
    }).sort({ createdAt: -1 });
};

module.exports.createPost = async (req, res) => {

    let fileName;
    // comme upload controller mais cette fois dans posts
    if (req.file !== null) {
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

        fileName = req.body.posterId + Date.now() + '.jpg';

        await pipeline(
            req.file.stream,
            fs.createWriteStream(
                `${__dirname}/../client/public/uploads/posts/${fileName}`
            )
        );
    }

    // ensuite on incremente notre base de donnee avec un lien
    const newPost = new PostModel({
        posterId: req.body.posterId,
        message: req.body.message,
        picture: req.file !== null ? "./uploads/posts/" + fileName : "",
        video: req.body.video,
        likers: [],
        comments: [],
    });

    try {
        const post = await newPost.save();
        return res.status(201).json(post);
    } catch (err) {
        return res.status(400).send(err);
    }
};

module.exports.updatePost = (req, res) => {
    if (!ObjectID.isValid(req.params.id)) 
        return res.status(400).send("ID unknown: " + req.params.id);

    const updatedRecord = {
        message: req.body.message
    };

    PostModel.findByIdAndUpdate(
        req.params.id,
        { $set: updatedRecord },
        { new: true },
        (err, docs) => {
            if(!err) res.send(docs);
            else console.log('Update Error ' + err);
        }
    );
};

module.exports.deletePost = (req, res) => {
    if (!ObjectID.isValid(req.params.id)) 
        return res.status(400).send("ID unknown: " + req.params.id);

    PostModel.findByIdAndRemove(
        req.params.id,
        (err, docs) => {
            if(!err) res.send(docs);
            else console.log('Delete Error ' + err);
        }
    );
};

//meme principe que follow and unfollow
module.exports.likePost = async (req, res) => {
    if (!ObjectID.isValid(req.params.id)) 
        return res.status(400).send("ID unknown: " + req.params.id);

    try {
        await PostModel.findByIdAndUpdate(
            req.params.id,
            {
                //add to set pour rajouter une donner sans ecraser les autres avant
                // et lui transmettre le id de la personne qui a liker
                $addToSet: { likers: req.body.id }
            },
            { new: true},
            (err, docs) => {
                if(err) return res.status(400).send(err);
            }
        );
        await UserModel.findByIdAndUpdate(
            req.body.id,
            {
                //add to set pour rajouter une donner sans ecraser les autres avant
                // et lui transmettre le id de la personne qui a liker
                $addToSet: { likes: req.params.id }
            },
            { new: true},
            (err, docs) => {
                if(!err) res.send(docs);
                else return res.status(400).send(err);
            }
        );
    } catch (err) {
        return res.status(400).send(err);
    }
};

module.exports.unlikePost = async (req, res) => {
    if (!ObjectID.isValid(req.params.id)) 
        return res.status(400).send("ID unknown: " + req.params.id);
    
    try {
        await PostModel.findByIdAndUpdate(
            req.params.id,
            {
                //pull pour retirer une donner sans ecraser les autres avant
                $pull: { likers: req.body.id }
            },
            { new: true},
            (err, docs) => {
                if(err) return res.status(400).send(err);
            }
        );
        await UserModel.findByIdAndUpdate(
            req.body.id,
            {
                $pull: { likes: req.params.id }
            },
            { new: true},
            (err, docs) => {
                if(!err) res.send(docs);
                else return res.status(400).send(err);
            }
        );
    } catch (err) {
        return res.status(400).send(err);
    }
};


//commentaire
module.exports.commentPost = (req, res) => {
    if (!ObjectID.isValid(req.params.id)) 
        return res.status(400).send("ID unknown: " + req.params.id);
    
    try {
        return PostModel.findByIdAndUpdate(
            req.params.id,
            {
                $push: { 
                    comments: {
                        commenterId: req.body.commenterId,
                        commenterPseudo: req.body.commenterPseudo,
                        text: req.body.text,
                        timestamp: new Date().getTime()
                    }
                }
            },
            { new: true},
            (err, docs) => {
                if(!err) res.send(docs);
                else return res.status(400).send(err);
            }
        );
    } catch (err) {
        return res.status(400).send(err);
    }
};

module.exports.editCommentPost = (req, res) => {
    if (!ObjectID.isValid(req.params.id)) 
        return res.status(400).send("ID unknown: " + req.params.id);

    try {
        return PostModel.findById(
            req.params.id,
            (err, docs) => {
                //the comment correspond au commentaire a editer
                // on lui demande de trouver le commentaire dans la doc
                // enumerer tous les commentaire avec find et ensuite selectionner celui que l'on veut modifier (theComment)
                const theComment = docs.comments.find((comment) => 
                    comment._id.equals(req.body.commentId)
                );

                if(!theComment) return res.status(400).send('Comment not found');
                theComment.text = req.body.text;

                return docs.save((err) => {
                    if(!err) return res.status(200).send(docs);
                    return res.status(500).send(err);
                });
            });
    } catch (err) {
        return res.status(400).send(err);
    }
};

module.exports.deleteCommentPost = (req, res) => {
    if (!ObjectID.isValid(req.params.id)) 
        return res.status(400).send("ID unknown: " + req.params.id);

    try {
        //find and update parcequon fait pas un delete du post mais dun commentaire dans le post
        return PostModel.findByIdAndUpdate(
            req.params.id,
            {
                $pull: { 
                    //on retire le commentaire qui a le id suivant
                    comments: {
                        _id: req.body.commentId,
                    }
                }
            },
            { new: true},
            (err, docs) => {
                if(!err) res.send(docs);
                else return res.status(400).send(err);
            }
        );
    } catch (err) {
        return res.status(400).send(err);
    }
};