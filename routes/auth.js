const express = require("express");
const path = require("path");
const authController = require("../controllers/auth");
const { check, body } = require("express-validator");
const user = require("../models/user");
const bcrypt = require("bcryptjs/dist/bcrypt");

const router = express.Router();

router.get("/login", authController.login);

router.post(
  "/login",
  [
    body("email", "Please enter a valid email")
      .isEmail()
      .custom((value, { req }) => {
        return user.findOne({ email: value }).then((userDoc) => {
          if (!userDoc) {
            return Promise.reject("Email don't exist");
          }
        });
      }),
    body(
      "password",
      "Password Incorrect, you can try the reset password"
    ).custom((value, { req }) => {
      return user.findOne({ email: req.body.email }).then((user) => {
        return bcrypt.compare(value, user.password).then((isMatched) => {
          if (!isMatched) {
            return Promise.reject(
              "Password Incorrect, you can try the reset function"
            );
          }
        });
      });
    }),
  ],
  authController.postLogin
);

router.post("/logout", authController.postLogout);

router.post(
  "/signup",
  [
    check("email")
      .isEmail()
      .withMessage("Please enter a valid email!!")
      .custom((value, { req }) => {
        return user.findOne({ email: value }).then((userDoc) => {
          if (userDoc) {
            return Promise.reject(
              "Email already exist, please choose a different email"
            );
          }
        });
      })
      .trim()
      .normalizeEmail(),
    body("password", "Please password can not be lesser than 6 character")
      .isLength({ min: 5 })
      .trim(),
    body("confirmPassword")
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error("Password have to match!");
        }
        return true;
      })
      .trim(),
  ],
  authController.postSignup
);

router.get("/signup", authController.getSignup);

router.get("/reset", authController.getReset);

router.get("/reset/:token", authController.getNewPassword);

module.exports = router;
