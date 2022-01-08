const express = require('express')
const path = require('path')
const ProductController = require('../controllers/products')
// const routeDir = require('../util/path')

const router = express.Router()


router.get('/add-product', ProductController.getProductPage)

router.post('/add-product', ProductController.postProductPage)

exports.routes = router
// exports.products = products