const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const portListening = process.env.PORT || 3000;

const errorController = require('./controllers/error');

const mongoose = require("mongoose");

const app = express();

const routes = require("./routes/index");

app.use(express.static(path.join(__dirname, 'public')));
app.set("view engine", "ejs");
app.set("views", "views");
app.use(bodyParser.urlencoded({extended: false}));


app.use("/", routes);
app.use(errorController.get404);



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
    app.listen(portListening, () => console.log("Starting on port: ", portListening));
  })
  .catch(err => {
    console.log(err);
  });




