const express = require('express')
const User = require('../models/user')
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
    const {email} = req.body
    // res.setHeader('Set-Cookie', 'loggedIn=true')
    User.find({email: email})
    .then(user => {
        req.session.isLoggedIn = true
        req.session.user = user
        req.session.save((err) => {
            console.log(err)
            res.redirect('/')
        })
        
        }
        )
        .catch(err => console.log(err))
}

exports.postLogout = (req, res) => {
    req.session.destroy(() => {
        res.redirect('/')
        
    })
}
 