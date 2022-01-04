const express = require('express')
const path = require('path')
const routeDir = require('../util/path')
const router = express.Router()
const adminData = require('./admin')

router.get('/', (req, res) => {
    console.log(adminData.products)
    // res.sendFile(path.join(routeDir, 'views', 'shop.html'))
    res.render('shop', {prod: adminData.products, docTitle: 'Shop'})
})

module.exports = router