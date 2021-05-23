const express = require("express")
const routes = express.Router();
//const app = require("express")

const mongoose = require("mongoose");
const User = require("../../models/e-comerce/user");

// Inner Routes
const admin = require("./admin");
const shop = require("./shop");
const auth = require("./auth");

routes.use("/", (req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then(user => {
      req.user = user;
      next();
    })
    .catch(err => console.log(err));

});

routes.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
});

routes.use("/admin", admin);
routes.use(shop);
routes.use(auth);

module.exports = routes;