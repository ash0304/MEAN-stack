// 引用 express模組
const express = require('express');

// 設app為使用express
const app = express();
// Middleware 中介軟體
app.use((req, res, next) => {
  // 排除CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  // 允許Header內容
  res.setHeader(
    "Acess-Control-Allow-Header",
    "Origin, X-Request-With, Content-Type, Accept"
  );
  // 允許方法
  res.setHeader(
    "Acess-Control-Allow-Methods",
    "GET, POST, PATCH, DELETE, PUT, OPTIONS")
  next();
})

app.use('/api/posts', (req, res, next) => {
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
    message: 'Posts fetched successfully!',
    posts: posts
  });
});

module.exports = app;


