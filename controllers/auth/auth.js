const User = require('../../models/user');

// Importing the "bcrypt" package to validate the passwords.
const bcrypt = require('bcryptjs');

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