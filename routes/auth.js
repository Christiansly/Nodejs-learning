const express = require('express')
const path = require('path')
const authController = require('../controllers/auth')

const router = express.Router()

router.get('/login', authController.login)

router.post('/login', authController.postLogin)

router.post('/logout', authController.postLogout)

router.post('/signup', authController.postSignup)

router.get('/signup', authController.getSignup)

router.get('/reset', authController.getReset)

module.exports = router