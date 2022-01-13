const Cart = require('../models/cart')
const Product = require('../models/product')

exports.getProducts = (req, res) => {
   
  
    
    Product.fetchAll().then(products => {
        res.render('shop/product-list', {prod: products, docTitle: 'All Products', path: '/products'})
    })
    // res.sendFile(path.join(routeDir, 'views', 'shop.html'))
    
}

exports.getIndex = (req, res) => {
    const products = Product.fetchAll().then((products) => {
    res.render('shop/index', {prod: products, docTitle: 'Shop', path: '/', hasProducts: products.length > 0, activeShop: true})
    }).catch(err => console.log(err))
}

exports.getCart = (req, res) => {
    Cart.getCart((cart) => {
        Product.fetchAll(products => {
            const cartProducts = []
            for (product of products) {
                const cartProductData = cart.products.find(prod => prod.id === product.id)
                if (cartProductData) {
                    cartProducts.push({productData: product, qty: cartProductData.qty})
                }
            }
            res.render('shop/cart', {
                path: '/cart',
                docTitle: "Your Cart",
                products: cartProducts
            })
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
    res.render('shop/orders', {
        path: '/orders',
        docTitle: "Orders"
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
    Product.findById(productId, (prod) => {
        Cart.addProduct(prod.id, prod.price)
        res.redirect('/cart')
    })
}

exports.postCartDeleteProduct = (req, res) => {
    const {productId} = req.body 
    Product.findById(productId, (prod) => {
        Cart.deleteProduct(productId, prod.price)
        res.redirect('/cart')
    })
    
}