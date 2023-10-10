const mongoose = require('mongoose');

const updateSchema = new mongoose.Schema({
  //风扇状态 00 - 11
  cf: String,
  //小灯状态 00 -11
  cl: String,
  //温度范围
  tl: String,
  tr: String,
  //亮度范围
  ll: String,
  lr: String,
  //控制风扇
  date: String
});

const Update = mongoose.model('update', updateSchema);
module.exports = Update;
