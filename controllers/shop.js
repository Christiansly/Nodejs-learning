const Cart = require('../models/cart')
const Product = require('../models/product')

exports.getProducts = (req, res) => {
   
  
    
    Product.find().then(products => {
        res.render('shop/product-list', {prod: products, docTitle: 'All Products', path: '/products'})
    })
    // res.sendFile(path.join(routeDir, 'views', 'shop.html'))
     
}

exports.getIndex = (req, res) => {
    const products = Product.find().then((products) => {
    res.render('shop/index', {prod: products, docTitle: 'Shop', path: '/', hasProducts: products.length > 0, activeShop: true})
    }).catch(err => console.log(err))
}

exports.getCart = (req, res) => {
    console.log(req.user)
    req.user.getCart().then(prod => {
            console.log('get cart', prod)
            res.render('shop/cart', {
                path: '/cart',
                docTitle: "Your Cart",
                products: prod
            })
        })
}

exports.getCheckout = (req, res) => {
    res.render('shop/checkout', {
        path: '/checkout',
        docTitle: "Checkout"
    })
}

exports.getOrders = (req, res) => {
    req.user.getOrder().then(items => {
        res.render('shop/orders', {
            path: '/orders',
            docTitle: "Orders",
            orders: items
        }) 
    })
    
}

exports.getProduct = (req, res) => {
    console.log(req.params.productId)
    const prodId = req.params.productId
    Product.findById(prodId).then(prod => {
        console.log(prod)
        res.render('shop/product-detail', {path: "/product-detail", product: prod, docTitle: prod.title})
    }).catch(err => console.log(err))
    
} 

exports.postCart = (req, res) => {
    const {productId} = req.body
    Product.findById(productId).then(prod => req.user.addToCart(prod)).then(result => {
        console.log(result) 
        res.redirect('/cart')}).catch(err => console.log(err))
}

exports.postCartDeleteProduct = (req, res) => {
    const {productId} = req.body 
    console.log(req.user)
    req.user.deleteCart(productId).then(prod => {

        res.redirect('/cart')
    })
    
}

exports.postOrder = (req, res) => {
    req.user.addToOrder().then(result => {
        console.log("Add to Order")
        res.redirect('/cart')
    })
}