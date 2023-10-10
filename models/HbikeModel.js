const mongoose = require('mongoose');

const HbikeSchema = new mongoose.Schema({
  id: String,
  //人员数量信息
  p: String,
  //温度
  t: String,
  //光线亮度
  l: String,
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

const Hbike = mongoose.model('Hbike', HbikeSchema);
module.exports = Hbike;
