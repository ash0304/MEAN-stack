const express = require("express");
// 引用bcrypt模組 , 用於加密密碼串
const bcrypt = require("bcrypt");

const User = require("../models/user");

const router = express.Router();

router.post("/signup", (req, res, next) => {
  bcrypt.hash(req.body.password, 10)
    .then(hash => {
      const user = new User({
        email: req.body.email,
        password: hash
      });
      // 存入資料庫
      user.save()
        // 成功處理
        .then(result => {
          res.status(201).json({
            message: "User Created!",
            result: result
          });
        })
        // 失敗處理
        .catch(err => {
          res.status(500).json({
            error: err
          });
        });
    });
});

module.exports = router;
