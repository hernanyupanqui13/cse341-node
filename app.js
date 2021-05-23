const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session") (session);
const csrf = require("csurf");
const flash = require("connect-flash");



const routes = require("./routes/index");


const portListening = process.env.PORT || 5000;
const MONGODB_URL = process.env.MONGODB_URL || "mongodb+srv://webClient:yupanqui@cluster0.u5wqk.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

const errorController = require('./controllers/error');


const app = express();
const store = new MongoDBStore({
  uri: MONGODB_URL,
  collection: "sessions"
});

const csrfProtection = csrf();

app.set("view engine", "ejs");
app.set("views", "views");



app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

app.use(
  session({
    secret:"my secret", 
    resave: false, 
    saveUninitialized:false,
    store:store
  })
);

app.use(csrfProtection);
app.use(flash());
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



mongoose
  .connect(
    MONGODB_URL, options
  )
  .then( () => {
    app.listen(portListening, () => console.log("Starting on port: ", portListening));
  })
  .catch(err => {
    console.log(err);
  });




