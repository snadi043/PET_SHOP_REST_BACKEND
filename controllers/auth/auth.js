exports.getLogin = (req, res, next) => {
    // const isLoggedInValue = req.get('Cookie');
    res.render('auth/login', {
        docTitle: 'Login Page',
        path: '/login',
        isLoggedIn: false, 
    });
}

exports.postLogin = (req, res, next) => {
    // res.setHeader('Set-Cookie', 'isLoggedIn = true');

    // Storing the value in the session object which is enabled by using the express-session package
    // by doing which the value is neither editable because of the "secret Key" configuration on the session
    // which is hashed and cannot be modified nor deleted because for every new request a session is created and doesnot die.
    req.session.isLoggedIn = true;
    res.redirect('/');
}

exports.postLogout = (req, res, next) => {
    req.session.destroy((err) => {
        console.log(err);
        res.redirect('/');
    });
}