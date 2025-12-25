const express = require('express');

const router = express.Router();

const {body} = require('express-validator');

const authController = require('../controllers/auth')

router.put('/signup', [
        body('email').isEmail().normalizeEmail(),
        body('password').trim().isLength({min: 5}),
        body('name').trim().notEmpty(),
    ],
    authController.signup
);

router.post('/login', authController.login);

module.exports = router;