
const User = require('../models/User');
const Assignment = require('../models/Assignment');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {body, validationResult} = require('express-validator');

const registerUser = [
    body('username').isLength({min: 3}),
    body('password').isLength({min: 5}),

    async (req, res) => {
        const errors = validationResult(req);
        if(!errors.empty()){
            return res.status(400).json({ errors: errors.array()});
        }

        const {username, password} = req.body;
        try{
            let user = await User.findOne({username});
            if(user) {
                return res.status(400).json({msg: 'User already exists'});
            }

            user = new User({username, password, role: 'user'});
            await user.save();  

            const payload = {user: {id: user.id}};
            jwt.sign(payload, 'your_jwt_secret', {expiresIn: 3600}, (err,token) => {
                if(err) throw err;
                res.json({token});
            });
        } catch(err){
            console.error(err.message);
            res.status(500).send('Server error');
        }
    }
];

const loginUser = [
    body('username').exists(),
    body('password').exists(),

    async (req, res) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({errors: errors.array()});
        }

        const {username, password} = req.body;
        try{
            let user = await User.findOne({ username });
            if(!user){
                return res.status(400).json({msg: 'Invalid Credentials'});
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if(!isMatch){
                return res.status(400).json({msg: 'Invalid Credentials'});
            }

            const payload = {user: { id: user.id}};
            jwt.sign(payload, 'your_jwt_secret', {expiresIn: 3600}, (err,token) => {
                if(err) throw err;
                res.json({token});
            });
        } catch(err){
            console.error(err.message);
            res.status(500).send('Server error');
        }
    }
];

const uploadAssignment = async (req, res) => {
    const {task, admin} = req.body;
    try{
        const assignment = new Assignment({
            userId: req.user.id,
            task,
            admin,
            status:'pending'
        });
        await assignment.save();
        res.json(assignment);
    } catch(err){
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

const getAdmins = async (req, res) => {
    try{
        const admins = await User.find({ role: 'admin'}).select('-password');
        res.json(admins);
    } catch(err){
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

module.export = {registerUser, loginUser, uploadAssignment, getAdmins};