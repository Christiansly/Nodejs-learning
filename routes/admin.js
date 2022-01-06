const express = require('express')
const path = require('path')

const routeDir = require('../util/path')

const router = express.Router()
const products = []

router.get('/add-product', (req, res) => {
    // res.send('<form action="/admin/add-product" method="POST"><input type="text" name="title"></input><button>Submit</button></form>')
    // res.sendFile(path.join(routeDir, 'views', 'add-product.html'))
    res.render('add-product', {docTitle: "Add Product", path: "/admin/add-product", activeProd: true, productCSS: true})
})

router.post('/add-product',( req, res, next) => {
    // console.log(req.body)
    products.push({title: req.body.title})
    res.redirect('/')
})

exports.routes = router
exports.products = products