const mongoose = require('mongoose');

const updateSchema = new mongoose.Schema({
  s: String,
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

const Update = mongoose.model('update', updateSchema);
module.exports = Update;
