exports.getLogin = (req, res, next) => {
    const isLoggedInValue = req.get('Cookie');
    res.render('auth/login', {
        docTitle: 'Login Page',
        path: '/login',
        isLoggedIn: isLoggedInValue, 
    });
}

exports.postLogin = (req, res, next) => {
    res.setHeader('Set-Cookie', 'isLoggedIn = true');
    res.redirect('/');
}