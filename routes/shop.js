const express = require('express')
const path = require('path')
const routeDir = require('../util/path')
const router = express.Router()
const ShopController = require('../controllers/shop')
const isAuth = require('../middleware/is-auth')

router.get('/', ShopController.getIndex)

router.get('/products', ShopController.getProducts)

router.get('/products/:productId', ShopController.getProduct)

router.get('/cart', isAuth, ShopController.getCart)

router.post('/cart', isAuth, ShopController.postCart)

router.post('/cart-delete-item', isAuth, ShopController.postCartDeleteProduct)

router.get('/orders', isAuth, ShopController.getOrders)

router.get('/checkout', isAuth, ShopController.getCheckout)

router.post('/create-order', isAuth, ShopController.postOrder)


module.exports = router