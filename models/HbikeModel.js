const mongoose = require('mongoose');

const HbikeSchema = new mongoose.Schema({
  id: String,
  //温度
  t: String,
  //关照状态
  l: String,
  //高温阈值
  hot: String,
  //是否发生火灾报警
  rh: String,
  //小灯状态
  cl: String,
  //多久提醒用户自动关灯
  st: String,
  //灯提醒位
  rst: String,
  //ll lr 关照阈值
  ll: String,
  //硬件系统时间
  date: String,
  //app设置时间
  date2: String
});

HbikeSchema.index({ date1: -1 });
const Hbike = mongoose.model('Hbike', HbikeSchema);
module.exports = Hbike;
