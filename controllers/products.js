const Product = require('../models/product')

exports.getProductPage = (req, res) => {
    // res.send('<form action="/admin/add-product" method="POST"><input type="text" name="title"></input><button>Submit</button></form>')
    // res.sendFile(path.join(routeDir, 'views', 'add-product.html'))
    res.render('admin/add-product', {docTitle: "Add Product", path: "/admin/add-product", activeProd: true, productCSS: true})
}

exports.postProductPage = (req, res) => {
    const product = new Product(req.body.title)
    product.save()
    res.redirect('/')
}

exports.getProducts = (req, res) => {
   
    const products = Product.fetchAll((products) => {
        res.render('shop/product-list', {prod: products, docTitle: 'Shop', path: '/', hasProducts: products.length > 0, activeShop: true})
    })
    // res.sendFile(path.join(routeDir, 'views', 'shop.html'))
    
}