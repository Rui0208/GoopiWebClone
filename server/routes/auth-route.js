const router = require("express").Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Product = require("../models/Product");
const registerValidation = require("../validation").registerValidation;
const loginValidation = require("../validation").loginValidation;
const profileValidation = require("../validation").profileValidation;
router.use("/", (req, res, next) => {
  console.log("正在使用auth");
  next();
});
router.get("/testAPI", (req, res) => {
  return res.send("成功連結auth route...");
});
//註冊使用者
router.post("/register", async (req, res) => {
  let { error } = registerValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const { username, account, password, role } = req.body;
  const userExist = await User.findOne({ username });
  if (userExist) {
    return res.status(400).send("使用者名稱已存在");
  }
  const accountExist = await User.findOne({ account });
  if (accountExist) {
    return res.status(400).send("帳號已存在");
  }
  const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
  if (!emailRegex.test(account)) {
    return res.status(400).send("電郵 無效");
  }
  try {
    const hashPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      username,
      account,
      password: hashPassword,
    });
    let savedUser = await newUser.save();
    return res.send({
      msg: "成功註冊",
      savedUser,
    });
  } catch (e) {
    return res.status(500).send(e.message);
  }
});
//登入
router.post("/login", async (req, res) => {
  let { error } = loginValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  const { account, password } = req.body;
  const user = await User.findOne({ account });
  console.log(user);
  if (!user) {
    return res.status(401).send("使用者不存在");
  }
  try {
    const passwordValid = await bcrypt.compare(password, user.password);
    if (!passwordValid) {
      return res.status(401).send("密碼錯誤");
    }

    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
    return res.send({
      message: "成功登入",
      token: "JWT " + token,
      user: user,
    });
  } catch (e) {
    return res.status(500).send(e.message);
  }
});
//修改密碼
router.patch("/editPassword/:_id", async (req, res) => {
  try {
    const { _id } = req.params;
    const { currentPassword, newPassword } = req.body;
    const user = await User.findOne({ _id });
    console.log(user);
    if (!user) {
      return res.status(404).send("找不到此使用者");
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    console.log(isMatch);
    if (!isMatch) {
      return res.status(400).send("密碼錯誤");
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // 更新用户记录的密码
    user.password = hashedNewPassword;
    await user.save();

    return res.send("密碼更新成功");
  } catch (e) {
    console.log(e);
    return res.status(500).send(e.message);
  }
});
//修改使用者資料
router.patch("/update/:_id", async (req, res) => {
  let { error } = profileValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  const { _id } = req.params;
  const updateItem = req.body;
  try {
    const updatedUser = await User.findOneAndUpdate(
      { _id },
      { $set: updateItem },
      { new: true }
    );
    if (!updatedUser) {
      return res.status(401).send("找不到此使用者");
    }
    // const userExist = await User.findOne({ username });
    // if (userExist) {
    //   return res.status(500).send("使用者名稱已存在");
    // }
    // const accountExist = await User.findOne({ account });
    // if (accountExist) {
    //   return res.status(500).send("帳號已存在");
    // }
    return res.send({ msg: "使用者已更新資訊", updatedUser });
  } catch (e) {
    return res.status(500).send(e.message);
  }
});
//刪除使用者
router.delete("/delete/:_id", async (req, res) => {
  try {
    const { _id } = req.params;
    console.log(_id);
    const deletedUser = await User.findOneAndDelete({ _id });

    if (!deletedUser) {
      return res.status(404).json({ message: "找不到指定的使用者" });
    }
    const products = await Product.find({ user: _id });
    await Product.deleteMany({ user: _id });
    res.json({
      message: "使用者和上架上品已成功刪除",
      deletedUser: deletedUser,
      products: products,
    });
  } catch (e) {
    res.status(500).send(e.message);
  }
});
//_id找使用找
router.get("/user/:_id", async (req, res) => {
  try {
    const { _id } = req.params;
    const findUser = await User.find({ _id });
    if (!findUser) {
      return res.status(404).send("找不到此使用者");
    }
    res.send(findUser);
  } catch (e) {
    res.status(500).send(e.message);
  }
});
//找所有使用者
router.get("/users", async (req, res) => {
  try {
    const findUsers = await User.find({});
    if (!findUsers || findUsers.length === 0) {
      return res.status(404).send("找不到使用者");
    }
    res.send(findUsers);
  } catch (e) {
    res.status(500).send(e.message);
  }
});
module.exports = router;
