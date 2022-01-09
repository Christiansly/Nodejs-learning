const express = require('express')
const path = require('path')
const routeDir = require('../util/path')
const router = express.Router()
const ShopController = require('../controllers/shop')

router.get('/', ShopController.getIndex)

router.get('/products', ShopController.getProducts)

router.get('/cart', ShopController.getCart)

router.get('/checkout', ShopController.getCheckout)

module.exports = router