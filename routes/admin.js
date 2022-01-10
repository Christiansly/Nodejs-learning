const express = require('express')
const path = require('path')
const adminController = require('../controllers/admin')
// const routeDir = require('../util/path')

const router = express.Router()


router.get('/add-product', adminController.getProductPage)

router.get('/products', adminController.getProducts)

router.post('/add-product', adminController.postProductPage)

router.get('/edit-product/:productId', adminController.getEditProduct)

router.post('/edit-product', adminController.postEditProduct)

router.post('/delete-product', adminController.postDeleteProduct)

exports.routes = router
// exports.products = products