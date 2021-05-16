
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
  title: {
    type:String,
    required:true
  },
  price: {
    type:String,
    requiered:true
  },
  description: {
    type:String,
    requiered:true
  },
  imageUrl: {
    type:String,
    requiered:true
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref:"User",
    required:true
  }
});

module.exports = mongoose.model("Product", ProductSchema);
