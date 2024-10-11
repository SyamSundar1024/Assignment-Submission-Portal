const { body, validationResult } = require('express-validator');

const userRegistrationValidation = [
    body('username')
        .isLength({ min: 3 })
        .withMessage('Username must be at least 3 characters long'),
    body('password')
        .isLength({ min: 5 })
        .withMessage('Password must be at least 5 characters long'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

const loginValidation = [
    body('username')
        .exists()
        .withMessage('Username is required'),
    body('password')
        .exists()
        .withMessage('Password is required'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

const assignmentValidation = [
    body('task')
        .notEmpty()
        .withMessage('Task is required'),
    body('admin')
        .notEmpty()
        .withMessage('Admin is required'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

module.exports = {
    userRegistrationValidation,
    loginValidation,
    assignmentValidation
};
