const express = require("express");

const path = require("path");
const bodyParser = require("body-parser");

const app = express();


const readRoute = require("./routes/bookinfo");

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

app.set("view engine", "ejs");
app.set("views", "views");

app.use(readRoute);


app.use("/", (req, res, next) => {
    res.status(404);
    res.render("404", {
        title: "404 Page not found"
    });
});


const portListening = process.env.PORT || 3000;
app.listen(portListening, () => console.log("Listening on: ", portListening));
