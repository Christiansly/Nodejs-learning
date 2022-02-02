const bcrypt = require("bcryptjs/dist/bcrypt");
const express = require("express");
const User = require("../models/user");
const router = express.Router();

exports.login = (req, res) => {
  console.log(req.session.isLoggedIn);
  res.render("auth/login", {
    path: "/login",
    docTitle: "Login",
    isLoggedIn: req.session.isLoggedIn,
    csrfToken: req.csrfToken()
  });
};

exports.postLogin = (req, res) => {
  const { email, password } = req.body;
  // res.setHeader('Set-Cookie', 'loggedIn=true')
  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        return res.redirect("/login");
      }
      console.log("user", user, password);
      bcrypt.compare(password, user.password).then((isMatched) => {
        console.log("ismat", isMatched);
        if (isMatched) {
          console.log(isMatched);
          req.session.isLoggedIn = true;
          req.session.user = user;
          return req.session.save((err) => {
            console.log('err',err);
            res.redirect("/");
          });
        }
        res.redirect("/login");
      });
    })
    .catch((err) => console.log(err));
};

exports.postLogout = (req, res) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
};

exports.postSignup = (req, res) => {
  const { email, password, confirmPassword } = req.body;
  User.findOne({ email: email })
    .then((result) => {
      if (result) {
        return res.redirect("/signup");
      }
      return bcrypt.hash(password, 12).then((hashPassword) => {
        const user = new User({
          email: email,
          password: hashPassword,
          cart: { items: [] },
        });
        return user.save();
      });
    })
    .then(() => {
      return res.redirect("/login");
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getSignup = (req, res) => {
  res.render("auth/signup", {
    path: "/signup",
    docTitle: "Signup",
    isLoggedIn: req.session.isLoggedIn,
  });
};
