const Cart = require('../models/cart')
const Product = require('../models/product')
const Order = require('../models/order')

exports.getProducts = (req, res) => {
   
  
    
    Product.find().then(products => {
        res.render('shop/product-list', {prod: products, docTitle: 'All Products', path: '/products'})
    })
    // res.sendFile(path.join(routeDir, 'views', 'shop.html'))
     
}

exports.getIndex = (req, res) => {
    // req.isLoggedIn = true
    console.log("isLoggedIn", req.isLoggedIn)
    const products = Product.find().then((products) => {
    res.render('shop/index', {prod: products, docTitle: 'Shop', path: '/', hasProducts: products.length > 0, activeShop: true,
    isLoggedIn: req.isLoggedIn})
    }).catch(err => console.log(err))
}

exports.getCart = (req, res) => {
    console.log(req.user)
    req.user.populate('cart.items.productId').then(user => {
            const prod = user.cart.items
            console.log(prod)
            // console.log('get cart', prod)
            res.render('shop/cart', {
                path: '/cart',
                docTitle: "Your Cart",
                products: prod,
                isLoggedIn: req.isLoggedIn
            })
        })
}

exports.getCheckout = (req, res) => {
    res.render('shop/checkout', {
        path: '/checkout',
        docTitle: "Checkout",
        isLoggedIn: req.isLoggedIn
    })
}

exports.getOrders = (req, res) => {
    
    Order.find({'user.userId': req.user._id}).then(items => {
        let total = items.map(item => {
            return item.products.reduce((prev, curr) => {return curr.quantity * curr.product.price + prev}, 0)
        }).reduce((prev, curr) => { return prev + curr}, 0)
        console.log('items ---',total)
        res.render('shop/orders', {
            path: '/orders',
            docTitle: "Orders",
            orders: items,
            total: total,
            isLoggedIn: req.isLoggedIn
        }) 
    })
    
}

exports.getProduct = (req, res) => {
    console.log(req.params.productId)
    const prodId = req.params.productId
    Product.findById(prodId).then(prod => {
        console.log(prod)
        res.render('shop/product-detail', {path: "/product-detail", product: prod, docTitle: prod.title,
        isLoggedIn: req.isLoggedIn})
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
    req.user.populate('cart.items.productId').then(user => {
        const products = user.cart.items.map(i => {
            return {quantity: i.quantity, product: {...i.productId._doc}}
        })
        const order = new Order({
            user: {
                username: req.user.username,
                userId: req.user
            },
            products: products
        })
        return order.save()
    }).then(result => req.user.clearCart()).then(result => {
            console.log("Add to Order")
            res.redirect('/cart')
        })
    // req.user.addToOrder().then(result => {
    //     console.log("Add to Order")
    //     res.redirect('/cart')
    // })
}