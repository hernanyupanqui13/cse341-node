const routes = require("express").Router();

const mongoose = require("mongoose");
const User = require("../../models/e-comerce/user");

// Inner Routes
const admin = require("./admin");
const shop = require("./shop");

routes
    .use("/", (req, res, next) => {
        User.findOne().then(user => {
            if (!user) {
              const user = new User({
                name: 'Hernan',
                email: 'hernan@greatdomain.com',
                cart: {
                  items: []
                }
              });
              user.save();
            }
        });

        User.findById('60a06b3df8f3c427c88f35a0')
            .then(user => {
                req.user = user;
                next();
            })
            .catch(err => console.log(err));

    })
    .use("/admin", admin)
    .use(shop);

module.exports = routes;