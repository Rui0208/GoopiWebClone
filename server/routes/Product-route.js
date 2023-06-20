const router = require("express").Router();
const Product = require("../models/Product");
const User = require("../models/User");
const prodouctValidation = require("../validation").prodouctValidation;
const passport = require("passport");
router.use("/", (req, res, next) => {
  console.log("正在使用Product-routes");
  next();
});

//新增商品
router.post(
  "/add",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    let { error } = prodouctValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    try {
      const { name, quantity, price, imageUrl, category, brand } = req.body;
      let imageUrls = imageUrl.map((imageName) => `/images/${imageName}`); // 拼接图片URL数组

      // let url = `/images/${imageUrl}`;
      const product = await Product.create({
        name,
        quantity,
        price,
        category,
        brand,
        imageUrl: imageUrls,

        user: req.user._id,
      });
      return res.send({
        msg: "已成功上架商品",
        product,
      });
    } catch (e) {
      res.status(500).send("上架商品失敗");
    }
  }
);
//查詢新商品
router.get("/categories/new-arrivals", async (req, res) => {
  try {
    const foundProduct = await Product.find({}).populate("user");
    if (!foundProduct) {
      return res.status(401).send("找不到任何商品");
    }
    return res.send(foundProduct);
  } catch (e) {
    return res.send(e.message);
  }
});

//查詢使用者個人商品
router.get(
  "/profile",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const foundUser = await Product.find({ user: req.user._id });
      console.log(foundUser);
      if (!foundUser) {
        return res.status(401).send("找不到使用者");
      }
      if (foundUser.length == 0) {
        return res.send("無上架商品");
      }
      return res.send(foundUser);
    } catch (e) {
      return res.send(e.message);
    }
  }
);

//查詢所有使用者商品
// router.get("/", async (req, res) => {
//   try {
//     const foundProduct = await Product.find({}).populate("user");
//     if (!foundProduct) {
//       return res.status(401).send("找不到任何商品");
//     }
//     return res.send(foundProduct);
//   } catch (e) {
//   }
// });
//透過id查詢商品
router.get("/:_id", async (req, res) => {
  const { _id } = req.params;
  console.log(_id);
  try {
    const foundProduct = await Product.findOne({ _id });
    console.log(foundProduct);
    return res.send({
      msg: "已找到商品",
      foundProduct,
    });
  } catch (e) {
    return res.status(500).send("找不到此id");
  }
});
//透過商品name查詢商品到此商品單獨頁面
router.get("/name/:productName", async (req, res) => {
  const { productName } = req.params;
  try {
    const foundProduct = await Product.findOne({ name: productName });
    return res.send({
      msg: "已找到商品",
      foundProduct,
    });
  } catch (e) {
    return res.status(500).send("找不到此id");
  }
});

//透過商品id更改商品資訊
router.put(
  "/profile/:productId",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const { productId } = req.params;
    const { name, quantity, price } = req.body;
    try {
      const updatedProduct = await Product.findOneAndUpdate(
        { _id: productId, user: req.user._id },
        { name, quantity, price },
        { new: true }
      );
      if (!updatedProduct) {
        return res.status(401).send("找不到此商品");
      }
      return res.send({ msg: "商品已更新資訊", updatedProduct });
    } catch (e) {
      return res.status(500).send(error.message);
    }
  }
);

//透過商品id更改商品資訊
router.patch(
  "/profile/:productId",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const { productId } = req.params;
    const updateItem = req.body;
    try {
      const updatedProduct = await Product.findOneAndUpdate(
        { _id: productId, user: req.user._id },
        { $set: updateItem },
        { new: true }
      );
      if (!updatedProduct) {
        return res.status(401).send("找不到此商品");
      }
      return res.send({ msg: "商品已更新資訊", updatedProduct });
    } catch (e) {
      return res.status(500).send(error.message);
    }
  }
);
//找出關鍵字商品
router.get("/search/:keyword", async (req, res) => {
  const { keyword } = req.params;
  console.log(keyword);
  try {
    const foundProducts = await Product.find({
      name: { $regex: keyword, $options: "i" },
    });

    if (foundProducts.length === 0) {
      return res.send("找不到相關商品");
    }

    return res.send(foundProducts);
  } catch (error) {
    console.error(error);
    return res.status(500).send("查詢商品時發生錯誤");
  }
});
//用category找出同類別商品
router.get("/categories/:category", async (req, res) => {
  const { category } = req.params;
  try {
    const foundProduct = await Product.find({ category: category });
    console.log(foundProduct);
    if (!foundProduct) {
      return res.status(401).send("找不到此類別商品");
    }
    return res.send({
      msg: "已找到商品",
      foundProduct,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).send("找不到此類別的商品");
  }
});
//同brand商品
//用category找出同類別商品
router.get("/brands/:brand", async (req, res) => {
  const { brand } = req.params;
  try {
    const foundProduct = await Product.find({ brand: brand });
    console.log(foundProduct);
    if (!foundProduct) {
      return res.status(401).send("找不到此品牌商品");
    }
    return res.send({
      msg: "已找到商品",
      foundProduct,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).send("找不到此品牌商品");
  }
});
//刪除商品
router.delete(
  "/profile/:productId",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const { productId } = req.params;
    try {
      const foundProduct = await Product.findOne({
        _id: productId,
        user: req.user._id,
      });
      if (!foundProduct) {
        return res.status(401).send("找不到此商品或無權力刪除");
      }
      await Product.deleteOne({ _id: productId }).exec();
      return res.send("此商品已刪除");
    } catch (e) {
      return res.send(e);
    }
  }
);

module.exports = router;
