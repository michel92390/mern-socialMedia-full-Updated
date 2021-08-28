//jshint esversion:6
const router = require('express').Router();
const postController = require('../controllers/post.controller');
const multer = require('multer');
const upload = multer();


//avoir tous les message
//api/post/...
router.get('/', postController.readPost);

//poster un message 
//router.post('/', postController.createPost);
//avant de jouer les controlleur de poste creer, on recupere ca
router.post('/', upload.single('file'), postController.createPost);
//update
router.put('/:id', postController.updatePost);
//delete
router.delete('/:id', postController.deletePost);

//intervenir a l'interieur d'un array a l'interieur d'un element
router.patch('/like-post/:id', postController.likePost);
router.patch('/unlike-post/:id', postController.unlikePost);

// comments
router.patch('/comment-post/:id', postController.commentPost);
router.patch('/edit-comment-post/:id', postController.editCommentPost);
router.patch('/delete-comment-post/:id', postController.deleteCommentPost);

module.exports = router;