const mongoose = require('mongoose');

const bikeSchema = new mongoose.Schema({
  id: String,
  //人员数量信息
  p: String,
  //温度
  t: String,
  //光线亮度
  l: String,
  //总营业额
  m: String,
  //风扇状态 00 - 11
  cf: String,
  //小灯状态 00 -11
  cl: String,
  //非法时间段
  dl: String,
  dr: String,
  //温度范围
  tl: String,
  tr: String,
  //亮度范围
  ll: String,
  lr: String,
  date: String
});

const Bike = mongoose.model('Bike', bikeSchema);
module.exports = Bike;
