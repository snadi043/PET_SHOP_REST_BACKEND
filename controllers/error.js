exports.getErrorPage = (req, res, next) => {
    res.status(404).render('404error', {
        docTitle: 'Error Page',
        path: '/404',
        isLoggedIn: req.isLoggedIn,
    });
}

exports.get500Page = (req, res, next) => {
    res.status(500).render('500error', {
        docTitle: 'Error',
        path: '/500',
        isLoggedIn: req.isLoggedIn,
    });
}