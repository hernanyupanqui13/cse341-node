const routes = require("express").Router();

// Inner Routes
const booksInfo = require("./bookinfo")


routes
    .use("/bookinfo", booksInfo)

    .get("/", (req, res, next) => {
        //res.render()
        console.log("1 aqui")
    })

    .use((req, res, next) => {
        res.render("404", {title: "404 - Page Not Found"});
        console.log("2 aqui");
    });


module.exports = routes;