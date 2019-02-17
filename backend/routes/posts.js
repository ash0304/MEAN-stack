const express = require("express");

// 引用post的schema
const Post = require('../models/post');

const router = express.Router();


//  POST
router.post("", (req, res, next) => {
  const post = new Post({
    title: req.body.title,
    content: req.body.content
  });
  // 將post的資料儲存回mongoDB
  post.save().then(result => {
    res.status(201).json({
      message: "Post added sucessfully",
      postId: result._id
    });
  });
});

router.put("/:id", (req, res, next) => {
  const post = new Post({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content
  });
  Post.updateOne({ _id: req.params.id }, post).then(result => {
    res.status(200).json({ message: "Update Successful!" });
  });
});

//  GET
router.get("", (req, res, next) => {
  // 從mongoDB找到資料
  Post.find().then(documents => {
    // console.log(documents);
    res.status(200).json({
      message: "Posts fetched sucessfully!",
      posts: documents
    });
  });
});

router.get("/:id", (req, res, next) => {
  Post.findById(req.params.id).then(post => {
    if (post) {
      res.status(200).json(post);
    } else {
      res.status(404).json({ message: "Post not found!" });
    }
  });
});

//  DELETE
router.delete("/:id", (req, res, next) => {
  Post.deleteOne({ _id: req.params.id }).then(result => {
    console.log(result);
    res.status(200).json({ message: "Post deleted!" });
  });
});

module.exports = router;

