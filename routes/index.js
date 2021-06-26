const routes = require("express").Router();


// Inner Routes
const booksInfo = require("./bookinfo/bookinfo");
const eCommerce = require("./e-commerce/");
const week08 = require("./week08_prove/index");
const week09 = require("./week09_prove/index");
const week10 = require("./week10_prove/index");


routes.use("/bookinfo", booksInfo);

routes.use("/e-commerce", eCommerce);

routes.use("/week08" , week08);

routes.use("/week09" , week09);

routes.use("/week10" , week10);


routes.get("/", (req, res, next) => {
  res.render("home", {title: "Web Site - Home "});
  console.log("1 aqui");
});

routes.use((req, res, next) => {
  console.log("no encontrada");
  res.render("404", {title: "404 - Page Not Found"});
});




module.exports = routes;