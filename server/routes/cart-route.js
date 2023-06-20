const router = require("express").Router();
const Product = require("../models/Product");
const Cart = require("../models/Cart");
router.use("/", (req, res, next) => {
  console.log("正在使用cart");
  next();
});
//將商品加入購物車
router.post("/:productId/purchase", async (req, res) => {
  const { productId } = req.params;
  const { quantity } = req.body;
  try {
    const product = await Product.findOne({ _id: productId });
    if (!product) {
      return res.status(401).send("找不到此商品");
    }
    if (product.quantity - quantity < 0) {
      return res.status(401).send("庫存數量不足");
    }
    const cartItem = { product: product._id, quantity };
    //如果購物車不存在，創建購物車
    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      cart = await Cart.create({ user: req.user._id, items: [cartItem] });
    } else {
      //檢查購物車內有沒有同商品
      const existingItem = cart.items.find(
        (item) => item.product.toString() === productId
      );
      if (existingItem) {
        //有的話增加數量
        existingItem.quantity += Number(quantity);
        if (existingItem.quantity > product.quantity) {
          return res.status(401).send("超過商品庫存");
        }
        await cart.save();
      } else {
        //如果商品不存在，新增商品項目
        cart.items.push(cartItem);
        await cart.save();
      }
    }
    let carts = await Cart.findOne({ user: req.user._id });
    return res.json({
      msg: "商品已成功加入購物車",
      cart,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).send(e.message);
  }
});

//結帳
router.post("/checkout", async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id });
    console.log(cart);
    if (cart.items.length === 0) {
      return res.send("購物車內無商品");
    } else {
      let total = 0;
      for (let i = 0; i < cart.items.length; i++) {
        let item = cart.items[i];
        console.log(cart.items.length);
        let product = await Product.findOne(item.product);

        if (product) {
          let itemTotal = product.price * item.quantity;
          total += itemTotal;
          //確認庫存
          if (product.quantity - item.quantity >= 0) {
            product.quantity -= item.quantity;

            await product.save();
          } else {
            return res.status(401).send("超出庫存數量");
          }
        }
      }
      cart.items = [];
      await cart.save();
      console.log(cart.items);
      return res.send("購物車總金額:" + total);
    }
  } catch (e) {
    return res.status(500).send(e.message);
  }
});
//查看購物車資訊
router.get("/", async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id }).populate(
      "items.product"
    );
    if (!cart || cart.items.length === 0) {
      return res.send("購物車內無商品");
    }
    return res.send(cart);
  } catch (error) {
    return res.status(500).send(error.message);
  }
});
//根據商品id刪除購物車內商品
router.delete("/items/:productId", async (req, res) => {
  const { productId } = req.params;
  const userId = req.user._id;
  try {
    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.send("購物車內無商品");
    }
    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId
    );
    if (itemIndex === -1) {
      return res.status(404).send("找不到此商品");
    }

    cart.items.splice(itemIndex, 1);
    await cart.save();
    return res.send("商品已從購物車刪除");
  } catch (e) {
    return res.status(500).send(e.message);
  }
});
//更改購物車內商品數量
router.patch("/items/:productId", async (req, res) => {
  const { productId } = req.params;
  const { quantity } = req.body;
  console.log(productId, quantity);
  const userId = req.user._id;
  try {
    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.send("購物車內無商品");
    }
    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId
    );
    if (itemIndex === -1) {
      return res.status(404).send("找不到此商品");
    }
    let product = await Product.findOne({ _id: cart.items[itemIndex].product });

    if (quantity > product.quantity) {
      return res.status(401).send("超過商品庫存");
    }
    cart.items[itemIndex].quantity = quantity;

    await cart.save();
    return res.send({ msg: "商品數量已更改", cart });
  } catch (e) {
    return res.status(500).send(error.message);
  }
});
module.exports = router;
