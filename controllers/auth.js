const { validationResult } = require('express-validator');

const jwt = require('jsonwebtoken');

const bcrypt = require('bcrypt');

const User = require('../models/users');

exports.signup = (req, res, next) => {
    const errors = validationResult(req);
        if(!errors.isEmpty()){
        const error = new Error('User Signup process failed.');
        error.statusCode = 422;
        throw error;
    };

    const email = req.body.email;
    const password = req.body.password;
    const name = req.body.name;

    bcrypt.hash(password, 12)
    .then(hashedPassword => {
        User.findOne({email: email})
        .then(userDoc => {
            if(userDoc){
                const error = new Error('An User with the given email and name already exists.');
                error.statusCode = 422;
                throw next(error);
            }
            const user = new User({email: email, password: hashedPassword, name: name});
            return user.save();  
        })
        .then(user => {
            res.status(201).json({message: 'A new user signedup successfully', userId: user._id});
        });
    })
    .catch(err => {
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
    });
}

exports.login = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    let loadedUser;
    User.findOne({email: email})
    .then(user => {
        if(!user){
            const error = new Error('User with the provided email is not found.');
            error.statusCode = 422;
            throw error;
        }
        loadedUser = user;
        return bcrypt.compare(password, user.password);
    })
    .then(isMathched => {
        if(!isMathched){
            const error = new Error('Password entered is not matched.');
            error.statusCode = 401;
            throw error;
        }
    const jwtToken = jwt.sign({
        email: loadedUser.email,
        userId: loadedUser._id.toString(),
        },
        'supersecretfortheapplication', 
        {expiresIn: '1h'}); 
        res.status(201).json({token: jwtToken, userId: loadedUser._id.toString()});
    })
    .catch(err => {
        if(!err.statusCode){
        err.statusCode = 500;
    }
    next(err);
});
}