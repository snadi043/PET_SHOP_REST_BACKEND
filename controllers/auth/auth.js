const User = require('../../models/user');

// Importing the "bcrypt" package to validate the passwords.
const bcrypt = require('bcryptjs');

// Crypto is the inbuilt node module to perform hashing functionality in the node application.
const crypto = require('crypto');

// Importing the packages nodemailer nodemailer-sendgrid-transport to implement "Email System" in the application.
const nodemailer = require('nodemailer');
const nodemailerSendgridTransport = require('nodemailer-sendgrid-transport');

const transport = nodemailer.createTransport(nodemailerSendgridTransport({
    auth: {
        api_key: process.env.EMAIL_API_KEY
    }
}));

exports.getLogin = (req, res, next) => {
    let errorMessage = Array.isArray(req.flash('error'));
    if(errorMessage.length > 0){
        errorMessage = errorMessage[0];
    }
    else{
        errorMessage = null;
    }
    // const isLoggedInValue = req.get('Cookie');
    res.render('auth/login', {
        docTitle: 'Login Page',
        path: '/login',
        isLoggedIn: false,
        errorMessage: errorMessage,
    });
}

exports.postLogin = (req, res, next) => {
    // res.setHeader('Set-Cookie', 'isLoggedIn = true');

    // Storing the value in the session object which is enabled by using the express-session package
    // by doing which the value is neither editable because of the "secret Key" configuration on the session
    // which is hashed and cannot be modified nor deleted because for every new request a session is created and doesnot die.
    
    // Implementing the "Singin" functionality.
    const email = req.body.email;
    const password = req.body.password;

    User.findOne({email: email}).then(user => {
    if(!user){
        req.flash('error', 'Invalid email or password');
        return res.redirect('/login')
    }
    bcrypt.compare(password, user.password)
    .then((isMatched) => {
        if(isMatched){
            req.session.isLoggedIn = true;
            // req.session.user = user;
            return req.session.save((err) => {
                console.log(err);
                res.redirect('/');
            });
        };
        res.redirect('/login')
    }).catch(err => {
        console.log(err);   
        res.redirect('/login');
    });
    }).catch(err => {console.log(err)});        
}

exports.postLogout = (req, res, next) => {
    req.session.destroy((err) => {
        console.log(err);
        res.redirect('/');
    });
}

exports.getSignup = (req, res, next) => {
    let message = Array.isArray(req.flash('error'));
    if(message.length > 0){
        message = message[0];
    }
    else{
        message = null;
    }
    res.render('auth/signup', {
        path: '/signup',
        docTitle: 'Signup Page',
        isLoggedIn: false,
        errorMessage: message,
    });
}

exports.postSignup = (req, res, next) => {
    // Extracting the values from the form over the "POST" method.
    const email = req.body.email;
    const password = req.body.password;
    const cpassword = req.body.cpassword;

    // If user already exists then navigate to login page.
    User.findOne({email: email}).then(user => {
    // this is the case for the first time user
    if(user){
        req.flash('error', 'E-mail already exists, Please try with a new email');
        return res.redirect('/signup');
    }
    // Hashing the password to overcome the security threats when dealing with sensitive data.
    return bcrypt.hash(password, 12).then(hashedPassword => {
    // Once, the password is hashed, it is then saved to the database along with the cart.
    const user = new User({email: email, password: hashedPassword, cart: {items: []}});
        return user.save();
    }).then(result => {
        res.redirect('/login');
        return transport.sendMail({
            to: email,
            from: 'shop@petshoponline.com',
            subject: 'YOU HAVE SUCCESSFULLY CREATED ACCOUNT WITH US.',
            html: '<h1>Sign up process successfully created.</h1>'
        });
    }).catch(err => {console.log(err)});
    }).catch(err => {
        console.log(err);
    });
}

exports.getReset = (req, res, next) => {
    let errorMessage = req.flash('error');

    if(errorMessage.length > 0) {
        errorMessage = errorMessage[0];
    }
    else{
        errorMessage = null;
    }
    res.render('auth/reset', {
        path: '/reset',
        docTitle: 'Password Reset',
        errorMessage: errorMessage,
    });
}

exports.postReset = (req, res, next) => {
    // crypto is the inbuilt node module to produce hashed text which can be used to authenticate the users with the email from the same application.
    crypto.randomBytes(32, (err, buffer) => {
        if(err){
            return res.redirect('/reset');
        }
        const token = buffer.toString('hex');
        User.findOne({email: req.body.email}).then(user => {
            if(!user){
                req.flash('error', 'No email found with the given email.');
            }
            res.redirect('/reset');
            // Once user with the valid email address if found, set the user fields with the necessary information
            // setting users resetToken and restTokenExpiryTime.
            user.resetToken = token,
            user.resetTokenExpiryTime = new Date.now() + 3600;
            return user.save();
            // Then send a email to the user to navigate back to the valid link of the application where the user can reset the password.
            // The link then contains the crypto encrypted token which is also saved to the database.
        }).then(result => {
            res.rediect('/');
            return transport.sendMail({
                to: req.body.email,
                from: 'shop@petshoponline.com',
                subject: '<h1>Reset Password</h1>',
                html: `
                    <p>You have requested to reset your password for your "PET SHOP" account.</p>
                    <p>Click the <a href="https://localhost:3000/reset/${token}">link</a> below to reset your password.</p>
                `
            });
        }).catch(err => {
        console.log(err);
        });
    });
}

exports.getNewPassword = (req, res, next) => {
    let errorMessage = req.flash('error');

    if(errorMessage.length > 0){
        errorMessage = errorMessage[0];
    }
    else{
        errorMessage = null;
    }

    // To create a new password, the user has to have a valid token.
    // To get access to valid token in this action we passed the token in the query of the crypto link.
    const resetToken = req.params.token;
    // Any user with the valid token which is matched to perform reset action and with the token validity is only allowed to perform the new password creation action.
    // So the below check on the "user" model verifies the conditions and for such a user only render the "new-password" page.
    User.findOne({resetToken: resetToken, resetTokenExpiryTime: {$gt: new Date.now()}}).then(user => {
        if(!user){
            req.flash('error', 'Token is either invalid or expired.');
        }
        res.render('auth/new-password', {
            docTitle: 'New Password',
            path: '/new-password',
            errorMessage: errorMessage,
            userId: user._id.toString(),
            resetToken: resetToken,
        });
    }).catch(err => {
        console.log(err);
    });
}

exports.postNewPassword = (req, res, next) => {
    // In this controller action, the new password is to be updated back to the database.
    // Before saving it to the database it has to be hasehd using bcrypt.
    // Before hashing the password, the user has to be verified with the valid resetToken, exipryTime and userId.

    // So first, it is necessary to access the values of userId, resetToken and expiryTime.
    const updatedPassword = req.body.password;
    const userId = req.body.userId;
    const resetToken = req.body.resetToken;
    let resetUser;

    User.findOne({_id: userId, resetToken: resetToken, resetTokenExpiryTime: {$gt: Date.now()}})
    .then(user => {
        resetUser = user;
        return bcrypt.hash(updatedPassword, 16);
    }).then(hashedPassword => {
        resetUser.password = hashedPassword;
        resetUser.token = undefined;
        resetUser.resetTokenExpiryTime = undefined;
        return resetUser.save();
    }).then(() => {
        res.redirect('/login');
    }).catch(err => {
        console.log(err);
    });
}