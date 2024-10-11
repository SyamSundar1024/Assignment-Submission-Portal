const express = require('express');
const router = express.Router();
const {registerUser, loginUser, uploadAssignment, getAdmins} = require('../controllers/userController');
const {authenticateUser} = require('../middlewares/authMiddleware');
//authenticateUser is used as security layer for to check the user is authenticated.
const {userRegisterValidation, loginValidation, assignmentValidation} = require('../utils/validators');

router.post('/register', function(req, res){
    userRegisterValidation, registerUser;
});
router.post('/login', function(req, res){
    loginValidation, loginUser;
});
router.post('/upload', function(req, res){
    assignmentValidation, authenticateUser,uploadAssignment;
});

router.get('/admins', getAdmins);

module.export = router;