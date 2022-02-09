exports.get404 = (req, res) => {
    // res.status(404).sendFile(path.join(__dirname, 'views', '404.html'))
    res.render('404', {docTitle: "404 - Page not found", path: "404",
    isLoggedIn: req.isLoggedIn})
}

exports.get500 = (req, res, next) => {
    res.status(500).render('500', {
        docTitle: 'Error!',
        path: '/500',
        isLoggedIn: req.session.isLoggedIn,
        csrfToken: req.csrfToken()
      });
}