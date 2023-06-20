const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const Product = require("./models/Product");
const authRouth = require("./routes/auth-route");
const cartRouth = require("./routes/cart-route");
const productRouth = require("./routes/Product-route");
const passport = require("passport");
require("./config/passport")(passport);
const cors = require("cors");

mongoose
  .connect("mongodb://localhost:27017/shopDB2")
  .then(() => {
    console.log("成功連結mongoDB");
  })
  .catch((e) => {
    console.log(e);
  });

app.use(express.json());
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use("/auth", authRouth);

app.use("/cart", passport.authenticate("jwt", { session: false }), cartRouth);

app.use("/product", productRouth);

app.listen(8080, () => {
  console.log("成功連結到port 8080 ...");
});
