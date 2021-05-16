const mongodb = require("mongodb");

const MongoClient = mongodb.MongoClient;
const uri = `mongodb+srv://webClient:yupanqui@cluster0.u5wqk.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`

const MongoConnect = (cb) => {
    MongoClient.connect(uri)
    .then(result => {
        console.log("Connected");
        cb(result);
    })
    .catch(err => {
        console.log(err);
    });
}

module.exports = MongoConnect;

