// 引用mongoose模組
const mongoose = require('mongoose');
// 設定Schema模式
const postSchema = mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true }
});
// 使用mongoose的model方法  ('名稱', 使用的Schema) 並exports 供外部使用
module.exports = mongoose.model('Post', postSchema);
