const Cart = require("../models/cart");
const Product = require("../models/product");
const Order = require("../models/order");
const path = require("path");
const fs = require("fs");
const PDFKit = require("pdfkit")

const ITEMS_PER_PAGE = 2

exports.getProducts = (req, res, next) => {
  Product.find()
    .then((products) => {
      res.render("shop/product-list", {
        prod: products,
        docTitle: "All Products",
        path: "/products",
        isLoggedIn: req.session.isLoggedIn,
      });
    })
    .catch((err) => next(new Error(err)));
  // res.sendFile(path.join(routeDir, 'views', 'shop.html'))
};

exports.getIndex = (req, res, next) => {
  // req.isLoggedIn = true
  const page = req.query.page
  console.log("isLoggedIn", req.session.isLoggedIn);
  const products = Product.find()
  .skip((page - 1) * ITEMS_PER_PAGE)
  .limit(ITEMS_PER_PAGE)
    .then((products) => {
      res.render("shop/index", {
        prod: products,
        docTitle: "Shop",
        path: "/",
        hasProducts: products.length > 0,
        activeShop: true,
      });
    })
    .catch((err) => next(new Error(err)));
};

exports.getCart = (req, res, next) => {
  console.log(req.user);
  req.user
    .populate("cart.items.productId")
    .then((user) => {
      const prod = user.cart.items;
      console.log(prod);
      // console.log('get cart', prod)
      res.render("shop/cart", {
        path: "/cart",
        docTitle: "Your Cart",
        products: prod,
        isLoggedIn: req.session.isLoggedIn,
      });
    })
    .catch((err) => next(new Error(err)));
};

exports.getCheckout = (req, res) => {
  res.render("shop/checkout", {
    path: "/checkout",
    docTitle: "Checkout",
    isLoggedIn: req.session.isLoggedIn,
  });
};

exports.getOrders = (req, res, next) => {
  Order.find({ "user.userId": req.session.user._id })
    .then((items) => {
      let total = items
        .map((item) => {
          return item.products.reduce((prev, curr) => {
            return curr.quantity * curr.product.price + prev;
          }, 0);
        })
        .reduce((prev, curr) => {
          return prev + curr;
        }, 0);
      console.log("items ---", total);
      res.render("shop/orders", {
        path: "/orders",
        docTitle: "Orders",
        orders: items,
        total: total,
        isLoggedIn: req.session.isLoggedIn,
      });
    })
    .catch((err) => next(new Error(err)));
};

exports.getProduct = (req, res, next) => {
  console.log(req.params.productId);
  const prodId = req.params.productId;
  Product.findById(prodId)
    .then((prod) => {
      console.log(prod);
      res.render("shop/product-detail", {
        path: "/product-detail",
        product: prod,
        docTitle: prod.title,
        isLoggedIn: req.session.isLoggedIn,
      });
    })
    .catch((err) => next(new Error(err)));
};

exports.postCart = (req, res, next) => {
  const { productId } = req.body;
  Product.findById(productId)
    .then((prod) => req.user.addToCart(prod))
    .then((result) => {
      console.log(result);
      res.redirect("/cart");
    })
    .catch((err) => next(new Error(err)));
};

exports.postCartDeleteProduct = (req, res, next) => {
  const { productId } = req.body;
  console.log(req.session.user);
  req.user
    .deleteCart(productId)
    .then((prod) => {
      res.redirect("/cart");
    })
    .catch((err) => next(new Error(err)));
};

exports.postOrder = (req, res, next) => {
  req.user
    .populate("cart.items.productId")
    .then((user) => {
      const products = user.cart.items.map((i) => {
        return { quantity: i.quantity, product: { ...i.productId._doc } };
      });
      const order = new Order({
        user: {
          email: req.user.email,
          userId: req.user,
        },
        products: products,
      });
      return order.save();
    })
    .then((result) => req.user.clearCart())
    .then((result) => {
      console.log("Add to Order");
      res.redirect("/cart");
    })
    .catch((err) => next(new Error(err)));
  // req.user.addToOrder().then(result => {
  //     console.log("Add to Order")
  //     res.redirect('/cart')
  // })
};

exports.getInvoice = (req, res, next) => {
  const { orderId } = req.params;
  Order.findById(orderId)
    .then((order) => {
      if (!order) {
        return next(new Error("No order found"));
      }
      if (order.user.userId.toString() !== req.user._id.toString()) {
        return next(new Error("Unauthorized"));
      }
      const invoiceName = "invoice-" + orderId + ".pdf";
      const invoicePath = path.join("data", "invoices", invoiceName);

      // fs.readFile(invoicePath, (err, data) => {
      //   if (err) {
      //     return next(err);
      //   }
      //   res.setHeader("Content-Type", "application/pdf");
      //   res.setHeader(
      //     "Content-Disposition",
      //     'inline; filename="' + invoiceName + '"'
      //   );
      //   res.send(data);
      // });

      const file = fs.createReadStream(invoicePath);
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        'inline; filename="' + invoiceName + '"'
      );
      const pdfDoc = new PDFKit()
      pdfDoc.pipe(fs.createWriteStream(invoicePath))
      pdfDoc.pipe(res)
      pdfDoc.fontSize(26).text('Invoice', {
        underline: true
      })
      pdfDoc.text('--------------------------------------------')
      let totalPrice = 0
      order.products.forEach(prod => {
        totalPrice += prod.quantity * prod.product.price
        pdfDoc.fontSize(14).text(prod.product.title + " - " + prod.quantity + " x " + prod.product.price)
        pdfDoc.text("Total Price: $" + totalPrice)
      })
      pdfDoc.end()
      // file.pipe(res)
    })
    .catch(err => next(err));
};
