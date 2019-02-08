// 引用 express模組
const express = require('express');

// 設app為使用express
const app = express();

app.use((req, res, next) => {
  console.log('First middleware');
  next();
});

app.use((req, res, next) => {
  res.send('Hello from express!');
});

module.exports = app;


