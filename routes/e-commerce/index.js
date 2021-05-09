const routes = require("express").Router();

// Inner Routes
const admin = require("./admin");
const shop = require("./shop");

routes
    .use("/admin", admin)
    .use(shop);

module.exports = routes;