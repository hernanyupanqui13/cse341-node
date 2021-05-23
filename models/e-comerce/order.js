const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const orderSchema = new Schema({
    products: [
        {
            product: {type: Object, required: true},
            quantity: {type: Number, requiered: true}
        }
    ], 
    user: {
        email: {
            type:String,
            requiered:true
        },
        userId: {
            type: Schema.Types.ObjectId,
            ref:"User",
            requiered:true
        }
    }
});

module.exports = mongoose.model("Order", orderSchema);