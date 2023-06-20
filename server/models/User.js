const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: { type: String, require: true, minlength: 3, maxlength: 50 },
  account: {
    type: String,
    require: true,
    minlength: 6,
    maxlength: 50,
  },
  password: { type: String, require: true, minlength: 6, maxlength: 255 },
  phoneNumber: {
    type: String,
    required: false,
  },
  lineId: {
    type: String,
    required: false,
  },

  date: { type: Date, default: Date.now },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
  },
});

module.exports = mongoose.model("User", UserSchema);
