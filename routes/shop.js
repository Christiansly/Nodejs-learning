const express = require('express')
const path = require('path')
const routeDir = require('../util/path')
const router = express.Router()
const ProductController = require('../controllers/products')

router.get('/', ProductController.getProducts)

module.exports = router