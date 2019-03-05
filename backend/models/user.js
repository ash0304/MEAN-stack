// 引用mongoose模組
const mongoose = require('mongoose');
// 引用 unique-validator 模組
const uniqueValidator = require('mongoose-unique-validator');

// 設定Schema模式
const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: {type: String, required: true}
});


userSchema.plugin(uniqueValidator);

// 使用mongoose的model方法  ('名稱', 使用的Schema) 並exports 供外部使用
module.exports = mongoose.model('User', userSchema);
