const bcrypt = require("bcryptjs/dist/bcrypt");
const express = require("express");
const User = require("../models/user");
const router = express.Router();
const nodemailer = require("nodemailer");
const sendgridTransporter = require("nodemailer-sendgrid-transport");
const crypto = require("crypto");
const user = require("../models/user");
const { validationResult } = require("express-validator");

const transporter = nodemailer.createTransport(
  sendgridTransporter({
    auth: {
      api_keys:
        "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",
    },
  })
);

exports.login = (req, res) => {
  console.log(req.session.isLoggedIn);
  // console.log(req.flash('error')[0])
  let message = req.flash("error");
  console.log(req.flash("error"));
  console.log(message);
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  console.log(message);
  res.render("auth/login", {
    path: "/login",
    docTitle: "Login",
    errorMessage: message,
    oldInput: {
      email: "",
      password: "",
    },
    validationError: []
  });
};

exports.postLogin = (req, res) => {
  const { email, password } = req.body;
  const error = validationResult(req);
  if (!error.isEmpty()) {
    console.log("check error", error.array());
    return res.status(422).render("auth/login", {
      path: "/login",
      docTitle: "Log-in",
      isLoggedIn: req.session.isLoggedIn,
      errorMessage: error.array()[0].msg,
      oldInput: {
        email: req.body.email,
        password: req.body.password,
      },
      validationError: error.array()
    });
  }
  // res.setHeader('Set-Cookie', 'loggedIn=true')
  User.findOne({ email: email })
    .then((user) => {
      //     if (!user) {
      //       req.flash("error", "Invalid Email");
      //       return res.redirect("/login");
      //     }
      //     console.log("user", user, password);
      //     bcrypt.compare(password, user.password).then((isMatched) => {
      //       console.log("ismat", isMatched);
      // if (isMatched) {
      //   console.log(isMatched);
      req.session.isLoggedIn = true;
      req.session.user = user;
      return req.session.save((err) => {
        console.log("err", err);
        res.redirect("/");
      });
    })
    // req.flash("error", "Password not correct");
    // res.redirect("/login");
    // });
    // })
    .catch((err) => console.log(err));
};

exports.postLogout = (req, res) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
};

exports.postSignup = (req, res) => {
  const { email, password, confirmPassword } = req.body;
  const error = validationResult(req);
  if (!error.isEmpty()) {
    console.log("check error", error.array());
    return res.status(422).render("auth/signup", {
      path: "/signup",
      docTitle: "Signup",
      isLoggedIn: req.session.isLoggedIn,
      errorMessage: error.array()[0].msg,
      oldInput: {
        email: req.body.email,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword,
      },
      validationError: error.array()
    });
  }
  // User.findOne({ email: email })
  //   .then((result) => {
  //     if (result) {
  //       req.flash("error", "Email already exist");
  //       return res.redirect("/signup");
  //     }
  //     if (password !== confirmPassword) {
  //       req.flash(
  //         "error",
  //         "Password dont match, please input passwords correctly"
  //       );
  //       return res.redirect("/signup");
  //     }
  bcrypt
    .hash(password, 12)
    .then((hashPassword) => {
      const user = new User({
        email: email,
        password: hashPassword,
        cart: { items: [] },
      });
      return user.save();
    })
    .then(() => {
      res.redirect("/login");
      return transporter.sendMail({
        to: email,
        from: "abiode23@gmail.com",
        subject: "Signup succeeded",
        html: "<h1>You successfully signed up</h1>",
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getSignup = (req, res) => {
  let message = req.flash("error");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render("auth/signup", {
    path: "/signup",
    docTitle: "Signup",
    isLoggedIn: req.session.isLoggedIn,
    errorMessage: message,
    oldInput: {
      email: "",
      password: "",
      confirmPassword: "",
    },
    validationError: []
  });
};

exports.getReset = (req, res) => {
  let message = null;
  res.render("auth/reset", {
    path: "/reset",
    docTitle: "Reset Password",
    errorMessage: message,
  });
};

exports.postReset = (req, res) => {
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      res.redirect("/reset");
    }
    const token = buffer.toString("hex");
    User.findOne({ emai: req.body.email })
      .then((user) => {
        if (!user) {
          req.flash("error", "Email does not exist");
          res.redirect("/reset");
        }
        user.resetToken = token;
        user.resetTokenExpiration = Date.now() + 360000;
        return user.save();
      })
      .then(() => {
        res.redirect("/");
        return transporter.sendMail({
          to: email,
          from: "myshop@node.com",
          subject: "Reset Passwprd",
          html: `
          <p>You requested a password reset</p>
          <p>Click <a href="http://localhost:3000/reset/${token}">link</a> to reset password</p>
          `,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  });
};

exports.getNewPassword = (req, res, next) => {
  const token = req.params.token;
  User.findOne({ resetToken: token, resetTokenExpiration: { $gt: Date.now() } })
    .then((user) => {
      let message = req.flash("error");
      if (message.length > 0) {
        message = message[0];
      } else {
        message = null;
      }
      res.render("auth/new-password", {
        path: "/new-password",
        pageTitle: "New Password",
        errorMessage: message,
        userId: user._id.toString(),
        passwordToken: token,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postNewPassword = (req, res, next) => {
  const newPassword = req.body.password;
  const userId = req.body.userId;
  const passwordToken = req.body.passwordToken;
  let resetUser;

  User.findOne({
    resetToken: passwordToken,
    resetTokenExpiration: { $gt: Date.now() },
    _id: userId,
  })
    .then((user) => {
      resetUser = user;
      return bcrypt.hash(newPassword, 12);
    })
    .then((hashedPassword) => {
      resetUser.password = hashedPassword;
      resetUser.resetToken = undefined;
      resetUser.resetTokenExpiration = undefined;
      return resetUser.save();
    })
    .then((result) => {
      res.redirect("/login");
    })
    .catch((err) => {
      console.log(err);
    });
};
