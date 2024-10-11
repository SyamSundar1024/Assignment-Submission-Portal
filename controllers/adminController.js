const User = require('../models/User');
const Assignment = require('../models/Assignment');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {body, validationResult} = require('express-validator');

const registerAdmin = [
    body('username').isLength({ min: 3 }),
    body('password').isLength({ min: 5 }),

    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { username, password } = req.body;
        try {
            let admin = await User.findOne({ username });
            if (admin) {
                return res.status(400).json({ msg: 'Admin already exists' });
            }

            admin = new User({ username, password, role: 'admin' });
            await admin.save();

            const payload = { user: { id: admin.id } };
            jwt.sign(payload, 'your_jwt_secret', { expiresIn: 3600 }, (err, token) => {
                if (err) throw err;
                res.json({ token });
            });
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server error');
        }
    }
];

const loginAdmin = [
    body('username').exists(),
    body('password').exists(),

    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { username, password } = req.body;
        try {
            let admin = await User.findOne({ username });
            if (!admin) {
                return res.status(400).json({ msg: 'Invalid credentials' });
            }

            const isMatch = await bcrypt.compare(password, admin.password);
            if (!isMatch) {
                return res.status(400).json({ msg: 'Invalid credentials' });
            }

            const payload = { user: { id: admin.id } };
            jwt.sign(payload, 'your_jwt_secret', { expiresIn: 3600 }, (err, token) => {
                if (err) throw err;
                res.json({ token });
            });
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server error');
        }
    }
];

const viewAssignment = async (req, res) => {
    try{
        const assignments = await Assignment.find({ admin: req.user.username});
        res.json(assignments);
    } catch(err){
        console.error(err.message);
        res.status(500).json({msg: 'Server error'});
    }
};

const acceptAssignment = async (req, res) => {
    try{
        const assignment = await Assignment.findById(req.params.id);
        if(!assignment){
            return res.status(404).json({msg: 'Assignment not found'});
        }
        assignment.status = 'accepted';
        await assignment.save();
        res.json(assignment);
    }
    catch(err){
        console.error(err.message);
        res.status(500).json({msg: 'Server error'});
    }
};

const rejectAssignment = async (req, res) => {
    try{
        const assignment = await Assignment.findById(req.paras.id);
        if(!assignment){
            return res.status(404).json({msg: 'Assignment not found'});
        }
        assignment.status = 'rejected';
        await assignment.save();
        res.json(assignment);
    } catch(err){
        console.error(err.message);
        res.status(500).json({msg: 'Server error'});
    }
};

module.export = {registerAdmin, loginAdmin, viewAssignment, acceptAssignment, rejectAssignment};