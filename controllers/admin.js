const { ObjectId } = require('mongodb')
const Product = require('../models/product')
const { getDB } = require('../util/database')

exports.getProductPage = (req, res) => {
    // res.send('<form action="/admin/add-product" method="POST"><input type="text" name="title"></input><button>Submit</button></form>')
    // res.sendFile(path.join(routeDir, 'views', 'add-product.html'))
    res.render('admin/edit-product', {docTitle: "Add Product", path: "/admin/add-product", editing: false, activeProd: true, productCSS: true})
}

exports.postProductPage = (req, res) => {
    const {title, price, description, imageUrl} = req.body
    let id
    const product = new Product({
        title: title,
        price: price,
        description: description,
        imageUrl: imageUrl,
        userId: req.user
    })
    product.save().then(result => {
        console.log('Created Product')
        res.redirect('/admin/products')
    }).catch(err => {
        console.log(err)
    })
    
}

//select() - choose the fields you want to get. populate() - get referemce model

exports.getEditProduct = (req, res) => {
    // res.send('<form action="/admin/add-product" method="POST"><input type="text" name="title"></input><button>Submit</button></form>')
    // res.sendFile(path.join(routeDir, 'views', 'add-product.html'))

    const {edit} = req.query
    if(!edit) {
        return res.redirect('/')
    }
    const {productId} = req.params
    Product.findById(productId).then(product => {
        if(!product) {
            return res.redirect('/')
        }
        res.render('admin/edit-product', {
            docTitle: "Edit Product",
            path: '/admin/edit-product',
            editing: edit,
            product: product
        })
    })
}

exports.postEditProduct = (req, res) => {
    const {productId, title, price, description, imageUrl} = req.body

    Product.findById(productId).then(product => {
        product.title = title
        product.price = price
        product.description = description
        product.imageUrl = imageUrl
        return product.save()
        
    }).then(result => {
        console.log("Updated")
        res.redirect('/admin/products')
    }).catch(err => {
        console.log(err)
    })
    
}

exports.postDeleteProduct = (req, res) => {
    const {productId} = req.body
    console.log(productId)
    Product.findByIdAndRemove(productId).then(() => res.redirect('/admin/products')).catch((err) => console.log(err))
    
}

exports.getProducts = (req, res) => {
    Product.find().then((products) => {
        res.render('admin/products', {prod: products, docTitle: 'Admin Product', path: '/admin/products', hasProducts: products.length > 0, activeShop: true})
    }).catch(err => console.log(err))
}