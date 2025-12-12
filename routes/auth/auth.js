const express = require('express');

const router = express.Router();

// Express Validator is confined with lot of modules and here "check" is the module used which is a middleware.
const {check, body} = require('express-validator');

const authController = require('../../controllers/auth/auth');

router.get('/login', authController.getLogin);

router.post('/login', authController.postLogin);

router.post('/logout', authController.postLogout);

router.get('/signup', authController.getSignup);

router.post('/signup', 
    check('email').isEmail().withMessage('Please enter a valid email-address')
    .custom((value, {req}) => {
        // If user already exists then navigate to login page.
        return User.findOne({email: value}).then(user => {
        // this is the case for the first time user
        if(user){
            return Promise.reject('E-mail already exists, Please try with a new email');
        }
        });
    }),
    body('password', 'Password should be within the range of 5-12 alpha-numeric charecters.').trim().isLength({min: 5, max: 12}).isAlphanumeric(),
    body('cpassword').custom((value, {req}) => {
        if(value !== req.body.password){
            throw new Error('Passwords should match each other.');
        }
        return true;
    }),
    authController.postSignup);

router.get('/reset', authController.getReset);

router.post('/reset', authController.postReset);

router.get('/new-password/:token', authController.getNewPassword);

router.post('/new-password', authController.postNewPassword);

module.exports = router;
