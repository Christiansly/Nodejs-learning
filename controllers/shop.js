const Cart = require("../models/cart");
const Product = require("../models/product");
const Order = require("../models/order");
const path = require("path");
const fs = require("fs");
const PDFKit = require("pdfkit");
const stripe = require('stripe')('sk_test_51KSGhYJlgBCrN61VyXP8UCM1jTmAgLr80jsxoIAIqdSocvlZywSwPJU8lLBLUMFoDxTOaSG2lRu1hBqvonNFMtr500lTAdVzci')

const ITEMS_PER_PAGE = 1;

exports.getProducts = (req, res, next) => {
  // Product.find()
  //   .then((products) => {
  //     res.render("shop/product-list", {
  //       prod: products,
  //       docTitle: "All Products",
  //       path: "/products",
  //       isLoggedIn: req.session.isLoggedIn,
  //     });
  //   })
  //   .catch((err) => next(new Error(err)));
  const page = req.query.page ? +req.query.page : 1;
  let totalItem;
  Product.find()
    .countDocuments()
    .then((numItem) => {
      totalItem = numItem;
      console.log(
        "last page",
        ITEMS_PER_PAGE,
        totalItem,
        Math.ceil(ITEMS_PER_PAGE / totalItem)
      );
      return Product.find()
        .skip((page - 1) * ITEMS_PER_PAGE)
        .limit(ITEMS_PER_PAGE);
    })
    .then((products) => {
      res.render("shop/product-list", {
        prod: products,
        docTitle: "All Products",
        path: "/products",
        totalProducts: totalItem,
        hasNextPage: page * ITEMS_PER_PAGE < totalItem,
        hasPreviousPage: page > 1,
        currentPage: page,
        nextPage: page + 1,
        previousPage: page - 1,
        lastPage: Math.ceil(totalItem / ITEMS_PER_PAGE),
        hasProducts: products.length > 0,
        activeShop: true,
      });
    })
    .catch((err) => next(new Error(err)));
};
// res.sendFile(path.join(routeDir, 'views', 'shop.html'))

exports.getIndex = (req, res, next) => {
  // req.isLoggedIn = true
  const page = req.query.page ? +req.query.page : 1;
  let totalItem;
  // console.log("isLoggedIn", req.session.isLoggedIn);
  Product.find()
    .countDocuments()
    .then((numItem) => {
      totalItem = numItem;
      console.log(
        "last page",
        ITEMS_PER_PAGE,
        totalItem,
        Math.ceil(ITEMS_PER_PAGE / totalItem)
      );
      return Product.find()
        .skip((page - 1) * ITEMS_PER_PAGE)
        .limit(ITEMS_PER_PAGE);
    })
    .then((products) => {
      res.render("shop/index", {
        prod: products,
        docTitle: "Shop",
        path: "/",
        totalProducts: totalItem,
        hasNextPage: page * ITEMS_PER_PAGE < totalItem,
        hasPreviousPage: page > 1,
        currentPage: page,
        nextPage: page + 1,
        previousPage: page - 1,
        lastPage: Math.ceil(totalItem / ITEMS_PER_PAGE),
        hasProducts: products.length > 0,
        activeShop: true,
      });
    })
    .catch((err) => next(new Error(err)));
};

exports.getCart = (req, res, next) => {
  req.user
    .populate('cart.items.productId')
    .then(user => {
      const products = user.cart.items;
      console.log('0000000000000', products)
      res.render('shop/cart', {
        path: '/cart',
        docTitle: 'Your Cart',
        products: products
      });
    })
    .catch(err => {
      console.log('err', err)
      const error = new Error(err);
      error.httpStatusCode = 500;
      // return next(error);
    });
};


// exports.getCheckout = (req, res) => {
//   res.render("shop/checkout", {
//     path: "/checkout",
//     docTitle: "Checkout",
//     isLoggedIn: req.session.isLoggedIn,
//   });
// };

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
    .catch((err) => console.log(err));
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
      const pdfDoc = new PDFKit();
      pdfDoc.pipe(fs.createWriteStream(invoicePath));
      pdfDoc.pipe(res);
      pdfDoc.fontSize(26).text("Invoice", {
        underline: true,
      });
      pdfDoc.text("--------------------------------------------");
      let totalPrice = 0;
      order.products.forEach((prod) => {
        totalPrice += prod.quantity * prod.product.price;
        pdfDoc
          .fontSize(14)
          .text(
            prod.product.title +
              " - " +
              prod.quantity +
              " x " +
              prod.product.price
          );
        pdfDoc.text("Total Price: $" + totalPrice);
      });
      pdfDoc.end();
      // file.pipe(res)
    })
    .catch((err) => next(err));
};

exports.getCheckout = (req, res, next) => {
  let products;
  let total = 0;
  req.user
    .populate('cart.items.productId')
    .then(user => {
      products = user.cart.items;
      console.log('products', products)
      total = 0;
      products.forEach(p => {
        total += p.quantity * p.productId.price;
      });
      console.log('total', total)
      return stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: products.map(p => {
          return {
            name: p.productId.title,
            description: p.productId.description,
            amount: p.productId.price * 100,
            currency: 'usd',
            quantity: p.quantity
          };
        }),
        success_url: req.protocol + '://' + req.get('host') + '/checkout/success', // => http://localhost:3000
        cancel_url: req.protocol + '://' + req.get('host') + '/checkout/cancel'
      });
    })
    .then(session => {
      res.render('shop/checkout', {
        path: '/checkout',
        pageTitle: 'Checkout',
        products: products,
        totalSum: total,
        sessionId: session.id
      });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getCheckoutSuccess = (req, res, next) => {
  req.user
    .populate('cart.items.productId')
    .then(user => {
      const products = user.cart.items.map(i => {
        return { quantity: i.quantity, product: { ...i.productId._doc } };
      });
      const order = new Order({
        user: {
          email: req.user.email,
          userId: req.user
        },
        products: products
      });
      console.log(order, products)
      return order.save();
    })
    .then(result => {
      return req.user.clearCart();
    })
    .then(() => {
      res.redirect('/orders');
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};