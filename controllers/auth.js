const express = require('express')

const router = express.Router()

exports.login = (req, res) => {
    console.log(req.session.isLoggedIn)
    res.render('auth/login', {
        path: '/login',
        docTitle: "Login",
        isLoggedIn: req.session.isLoggedIn
    }) 
}

exports.postLogin = (req, res) => {
    // res.setHeader('Set-Cookie', 'loggedIn=true')
    req.session.isLoggedIn = true
    res.redirect('/')
}
 