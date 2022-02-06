const { ObjectId } = require("mongodb");
const Product = require("../models/product");
const { getDB } = require("../util/database");

exports.getProductPage = (req, res) => {
  // res.send('<form action="/admin/add-product" method="POST"><input type="text" name="title"></input><button>Submit</button></form>')
  // res.sendFile(path.join(routeDir, 'views', 'add-product.html'))/
  // if(!req.session.isLoggedIn) {
  //     return res.redirect('/login')
  // }
  res.render("admin/edit-product", {
    docTitle: "Add Product",
    path: "/admin/add-product",
    editing: false,
    activeProd: true,
    productCSS: true,
    isLoggedIn: req.session.isLoggedIn,
  });
};

exports.postProductPage = (req, res) => {
  const { title, price, description } = req.body;
  const imageUrl = req.file;
  console.log("image", imageUrl)
  let id;
  const product = new Product({
    title: title,
    price: price,
    description: description,
    imageUrl: imageUrl,
    userId: req.user,
  });
  product
    .save()
    .then((result) => {
      console.log("Created Product");
      res.redirect("/admin/products");
    })
    .catch((err) => {
      console.log('debugging',err);
      next(new Error(err));
    });
};

//select() - choose the fields you want to get. populate() - get referemce model

exports.getEditProduct = (req, res) => {
  // res.send('<form action="/admin/add-product" method="POST"><input type="text" name="title"></input><button>Submit</button></form>')
  // res.sendFile(path.join(routeDir, 'views', 'add-product.html'))

  const { edit } = req.query;
  if (!edit) {
    return res.redirect("/");
  }
  const { productId } = req.params;
  Product.findById(productId)
    .then((product) => {
      if (!product) {
        return res.redirect("/");
      }
      res.render("admin/edit-product", {
        docTitle: "Edit Product",
        path: "/admin/edit-product",
        editing: edit,
        product: product,
        isLoggedIn: req.session.isLoggedIn,
      });
    })
    .catch((err) => next(new Error(err)));
};

exports.postEditProduct = (req, res) => {
  const { productId, title, price, description, imageUrl } = req.body;

  Product.findById(productId)
    .then((product) => {
      if (product.userId !== req.user._id) {
        return res.redirect("/");
      }
      product.title = title;
      product.price = price;
      product.description = description;
      product.imageUrl = imageUrl;
      return product.save().then((result) => {
        console.log("Updated");
        res.redirect("/admin/products");
      });
    })
    .catch((err) => next(new Error(err)));
};

exports.postDeleteProduct = (req, res) => {
  const { productId } = req.body;
  console.log(productId);
  // Product.findByIdAndRemove(productId).then(() => res.redirect('/admin/products')).catch((err) => console.log(err))
  Product.deleteOne({ _id: productId, userId: req.user._id })
    .then(() => res.redirect("/admin/products"))
    .catch((err) => next(new Error(err)));
};

exports.getProducts = (req, res) => {
  Product.find({ userId: req.user._id })
    .then((products) => {
      res.render("admin/products", {
        prod: products,
        docTitle: "Admin Product",
        path: "/admin/products",
        hasProducts: products.length > 0,
        activeShop: true,
        isLoggedIn: req.session.isLoggedIn,
      });
    })
    .catch((err) => next(new Error(err)));
};
