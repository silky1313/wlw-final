const mongoose = require('mongoose');

const HbikeSchema = new mongoose.Schema({
  id: String,
  //站台内人数
  p: String,
  //温度
  t: String,
  //光线亮度
  l: String,
  //乘车总人数
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

HbikeSchema.index({ date: -1 });
const Hbike = mongoose.model('Hbike', HbikeSchema);
module.exports = Hbike;
