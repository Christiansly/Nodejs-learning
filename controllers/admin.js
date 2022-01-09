const Product = require('../models/product')

exports.getProductPage = (req, res) => {
    // res.send('<form action="/admin/add-product" method="POST"><input type="text" name="title"></input><button>Submit</button></form>')
    // res.sendFile(path.join(routeDir, 'views', 'add-product.html'))
    res.render('admin/add-product', {docTitle: "Add Product", path: "/admin/add-product", activeProd: true, productCSS: true})
}

exports.postProductPage = (req, res) => {
    const {title, price, description, imageUrl} = req.body
    const product = new Product(req.body.title, req.body.description, req.body.imageUrl, req.body.price)
    product.save()
    res.redirect('/')
}

exports.getProducts = (req, res) => {
    Product.fetchAll((products) => {
        res.render('admin/products', {prod: products, docTitle: 'Admin Product', path: '/admin/products', hasProducts: products.length > 0, activeShop: true})
    })
}