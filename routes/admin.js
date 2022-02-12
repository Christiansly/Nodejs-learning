const express = require('express')
const path = require('path')
const adminController = require('../controllers/admin')
const isAuth = require('../middleware/is-auth')
// const routeDir = require('../util/path')

const router = express.Router()


router.get('/add-product', isAuth, adminController.getProductPage)

router.get('/products', isAuth, adminController.getProducts)

router.post('/add-product', isAuth, adminController.postProductPage)

router.get('/edit-product/:productId', isAuth, adminController.getEditProduct)

router.post('/edit-product', isAuth, adminController.postEditProduct)

router.delete('/product/:productId', isAuth, adminController.deleteProduct)

exports.routes = router;
// exports.products = products