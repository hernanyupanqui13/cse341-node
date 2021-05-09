const routes = require("express").Router();

// Inner Routes
const booksInfo = require("./bookinfo/bookinfo");
const eCommerce = require("./e-commerce/");

routes
    .use("/bookinfo", booksInfo)
    .use("/e-commerce", eCommerce)

    .get("/", (req, res, next) => {
        res.render("home", {title: "Web Site - Home "})
        console.log("1 aqui")
    })

    .use((req, res, next) => {
        res.render("404", {title: "404 - Page Not Found"});
        console.log("2 aqui");
    });


module.exports = routes;