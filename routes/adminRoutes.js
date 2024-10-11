const express = require('express');
const router = express.Router();
const {registerAdmin, loginAdmin, viewAssignment, acceptAssignment, rejectAssignment} = require('../controllers/adminController');
const {authenticateUser} = require('../middlewares/authMiddleware');

router.post('/register', function(req, res){
    registerAdmin;
});
router.post('/login', function(req, res){
    loginAdmin;
});
router.get('/assignments', authenticateUser, viewAssignment);
router.post('/assignment/:id/accept', function(req, res){
    authenticateUser, acceptAssignment;
});
router.post('/assignments/:id/reject', function(req, res){
    authenticateUser, rejectAssignment;
});

module.exports = router;