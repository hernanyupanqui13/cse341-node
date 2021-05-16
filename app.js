const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");

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


const cors = require('cors') // Place this with other requires (like 'path' and 'express')

const corsOptions = {
    origin: "https://sheltered-fjord-89753.herokuapp.com/",
    optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

const options = {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    family: 4
};

const MONGODB_URL = process.env.MONGODB_URL || "mongodb+srv://webClient:yupanqui@cse341cluster-3dwlw.mongodb.net/test?retryWrites=true&w=majority";
                        




mongoose
  .connect(
    MONGODB_URL, options
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
    const portListening = process.env.PORT || 3000;

    app.listen(portListening, () => console.log("Starting on port: ", portListening));
  })
  .catch(err => {
    console.log(err);
  });




