//jshint esversion:6
const router = require('express').Router();
const authController = require('../controllers/auth.controller');
const userController = require('../controllers/user.controller');
const uploadController = require('../controllers/upload.controller');
const multer = require('multer');
const upload = multer();


//auth
router.post('/register', authController.signUp);
router.post('/login', authController.signIn);
router.get('/logout', authController.logout);

//userdb
router.get('/', userController.getAllUsers);
router.get('/:id', userController.userInfo);
//for update(PUT)
router.put('/:id', userController.updateUser);
//delete
router.delete('/:id', userController.deleteUser);
//mettre a jour un tableau a l'interieur d'un utilisateur
router.patch('/follow/:id', userController.follow);
router.patch('/unfollow/:id', userController.unfollow);

//upload
router.post('/upload', upload.single('file'), uploadController.uploadProfil);

module.exports = router;