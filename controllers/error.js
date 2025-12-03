exports.getErrorPage = (req, res, next) => {
    res.status(404).render('404error', {
        docTitle: 'Error Page',
        path: '/404',
        isLoggedIn: req.isLoggedIn,
    });
}