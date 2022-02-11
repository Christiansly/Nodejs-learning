const { ObjectId } = require("mongodb");
const Product = require("../models/product");
const { getDB } = require("../util/database");
const fileHelper = require("../util/file");

exports.getProductPage = (req, res, next) => {
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

exports.postProductPage = (req, res, next) => {
  const { title, price, description } = req.body;
  console.log("error 1111");
  const image = req.file;
  let imageUrl;
  if (image) {
    console.log('hello')
    imageUrl = image.path;
  }
  console.log("image", imageUrl);
  let id;
  const product = new Product({
    title: title,
    price: price,
    description: description,
    imageUrl: imageUrl,
    userId: req.user,
    csrfToken: req.csrfToken(),
  });
  product
    .save()
    .then((result) => {
      console.log("Created Product");
      res.redirect("/admin/products");
    })
    .catch((err) => {
      console.log("debugging", err);
      next(new Error(err));
    });
};

//select() - choose the fields you want to get. populate() - get referemce model

exports.getEditProduct = (req, res, next) => {
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

exports.postEditProduct = (req, res, next) => {
  const { productId, title, price, description } = req.body;
  const image = req.file;
  console.log(image);
  Product.findById(productId)
    .then((product) => {
      if (product.userId.toString() !== req.user._id.toString()) {
        console.log(req.user._id, product.userId);
        return res.redirect("/");
      }
      fileHelper.deleteFile(product.imageUrl);
      product.title = title;
      product.price = price;
      product.description = description;
      if (image) {
        product.imageUrl = image.path;
      }

      return product.save().then((result) => {
        console.log("Updated");
        res.redirect("/admin/products");
      });
    })
    .catch((err) => next(new Error(err)));
};

exports.postDeleteProduct = (req, res, next) => {
  const { productId } = req.body;
  console.log(productId);
  // Product.findByIdAndRemove(productId).then(() => res.redirect('/admin/products')).catch((err) => console.log(err))
  Product.findById(productId)
    .then((prod) => {
      console.log(prod, "Prod we want to delete")
      if (!prod) {
        console.log(prod, "jjjdjd")
        return next(new Error("No product Found"));
      }
      console.log(prod.imageUrl)
      fileHelper.deleteFile(prod.imageUrl);
      console.log("After deleting image")
      console.log(req.user._id)
      return Product.deleteOne({ _id: productId, userId: req.user._id });
    })
    .then(() => {
      console.log("Deleted")
      res.redirect("/admin/products")})
    .catch((err) => next(new Error(err)));
};

exports.getProducts = (req, res, next) => {
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
