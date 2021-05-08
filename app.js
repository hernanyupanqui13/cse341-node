const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const portListening = process.env.PORT || 3000;


const app = express();

const routes = require("./routes/index");
//const readRoute = require("./routes/bookinfo");

app.use(express.static(path.join(__dirname, 'public')));
app.set("view engine", "ejs");
app.set("views", "views");
app.use(bodyParser.urlencoded({extended: false}));


app.use("/", routes);


app.listen(portListening, () => console.log("Listening on: ", portListening));
