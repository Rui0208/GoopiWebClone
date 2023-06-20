const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true,
    minlength: 3,
    maxlength: 100,
  },
  quantity: {
    type: Number,
    require: true,
    minlength: 0,
    minlength: 9999,
  },
  price: {
    type: Number,
    require: true,
    minlength: 0,
    minlength: 999999,
  },
  category: {
    type: String,
    enum: ["TOP", "BOTTOM", "HEADWEAR", "ACCESSORIES"],
    required: true,
  },
  brand: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: [String],
    require: true,
  },

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});
const Product = mongoose.model("Product", productSchema);
module.exports = Product;
