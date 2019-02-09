// 引用 express模組
const express = require('express');
// 引用body-parser
const bodyParser = require('body-parser');
// 引用mongoose
const mongoose = require('mongoose');

// 引用post的schema
const Post = require('./models/post');

// 設app為使用express
const app = express();
// 使用mongoose的connect方法連線
mongoose.connect("mongodb+srv://ash:5TWh7MsJM2nJaYSl@cluster0-ct9r0.mongodb.net/node-angular?retryWrites=true", { useNewUrlParser: true })
  .then(() => {
    console.log("Connect to Database!");
  })
  .catch(() => {
    console.log("Connection Failed!");
  });

// 使用body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Middleware 中介軟體
app.use((req, res, next) => {
  // 排除CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  // 允許Header內容 "Acess-Control-Allow-Headers"
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Request-With, Content-Type, Accept"
  );
  // 允許方法
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, DELETE, PUT, OPTIONS")
  next();
})

// Mideeleware - POST
app.post("/api/posts", (req, res ,next) => {
  const post = new Post({
    title: req.body.title,
    content : req.body.content
  });
  // 將post的資料儲存回mongoDB
  post.save();
  res.status(201).json({
    message: 'Post added sucessfully'
  });
});

app.get('/api/posts', (req, res, next) => {
  const posts = [
    {
      id: 'fadf12321l',
      title: 'First server-side post',
      content: 'This is coming from the server'
    },
    {
      id: '2312321hkl2',
      title: 'Second server-side post',
      content: 'This is coming from the server!'
    },
  ];
  res.status(200).json({
    message: 'Posts fetched sucessfully!',
    posts: posts
  });
});

module.exports = app;


