const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const portListening = process.env.PORT || 3000;

const mongoConnect = require("./util/database");
const mongoose = require("mongoose");

const app = express();

const routes = require("./routes/index");
//const readRoute = require("./routes/bookinfo");

app.use(express.static(path.join(__dirname, 'public')));
app.set("view engine", "ejs");
app.set("views", "views");
app.use(bodyParser.urlencoded({extended: false}));


app.use("/", routes);



mongoose
  .connect(
    `mongodb+srv://webClient:yupanqui@cluster0.u5wqk.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`
  )
  .then( () => {
    /*User.findOne().then(user => {
      if (!user) {
        const user = new User({
          name: 'Max',
          email: 'max@test.com',
          cart: {
            items: []
          }
        });
        user.save();
      }
    });*/
    app.listen(5000);
  })
  .catch(err => {
    console.log(err);
  });




