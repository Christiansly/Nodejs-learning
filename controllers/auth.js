const bcrypt = require("bcryptjs/dist/bcrypt");
const express = require("express");
const User = require("../models/user");
const router = express.Router();

exports.login = (req, res) => {
  console.log(req.session.isLoggedIn);
  // console.log(req.flash('error')[0])
  let message = req.flash('error')
  console.log(req.flash('error'))
  console.log(message)
  if (message.length > 0) {
    message = message[0]
  } else {
    message = null
  }
  console.log(message)
  res.render("auth/login", {
    path: "/login",
    docTitle: "Login",
    errorMessage: message
  });
};

exports.postLogin = (req, res) => {
  const { email, password } = req.body;
  // res.setHeader('Set-Cookie', 'loggedIn=true')
  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        req.flash('error', "Invalid Email")
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
        req.flash('error', "Password not correct")
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
        req.flash('error', 'Email already exist')
        return res.redirect("/signup");
      }
      if (password !== confirmPassword) {
        req.flash('error', 'Password dont match, please input passwords correctly')
        return res.redirect('/signup')
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
  let message = req.flash('error')
  if (message.length > 0) {
    message = message[0]
  } else {
    message = null
  }
  res.render("auth/signup", {
    path: "/signup",
    docTitle: "Signup",
    isLoggedIn: req.session.isLoggedIn,
    errorMessage: message
  });
};
