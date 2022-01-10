const Product = require('../models/product')

exports.getProductPage = (req, res) => {
    // res.send('<form action="/admin/add-product" method="POST"><input type="text" name="title"></input><button>Submit</button></form>')
    // res.sendFile(path.join(routeDir, 'views', 'add-product.html'))
    res.render('admin/edit-product', {docTitle: "Add Product", path: "/admin/add-product", editing: false, activeProd: true, productCSS: true})
}

exports.postProductPage = (req, res) => {
    const {title, price, description, imageUrl} = req.body
    const product = new Product(null, req.body.title, req.body.description, req.body.imageUrl, req.body.price)
    product.save()
    res.redirect('/')
}

exports.getEditProduct = (req, res) => {
    // res.send('<form action="/admin/add-product" method="POST"><input type="text" name="title"></input><button>Submit</button></form>')
    // res.sendFile(path.join(routeDir, 'views', 'add-product.html'))

    const {edit} = req.query
    if(!edit) {
        return res.redirect('/')
    }
    const {productId} = req.params
    Product.findById(productId, product => {
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
    const updatedProduct = new Product(productId, title, description, imageUrl, price)
    updatedProduct.save()
    res.redirect('/admin/products')
}

exports.postDeleteProduct = (req, res) => {
    const {productId} = req.body
    console.log(productId)
    Product.deleteProduct(productId)
    res.redirect('/admin/products')
}

exports.getProducts = (req, res) => {
    Product.fetchAll((products) => {
        res.render('admin/products', {prod: products, docTitle: 'Admin Product', path: '/admin/products', hasProducts: products.length > 0, activeShop: true})
    })
}