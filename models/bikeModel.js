const mongoose = require('mongoose');

const bikeSchema = new mongoose.Schema({
  id: String,
  //温度
  t: String,
  //亮度
  l: String,
  //灯光状态
  s: String,
  //人口数量
  a: String,
  //加热器是否打开
  h: String,
  //当前数据的时间
  date: String,
  //时间区间
  dl: String,
  dr: String,
  //亮度区间
  ll: String,
  lr: String,
  //温度区间
  tl: String,
  tr: String
});

const Bike = mongoose.model('Bike', bikeSchema);
module.exports = Bike;
