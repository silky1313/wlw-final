const mongoose = require('mongoose');

const amountSchema = new mongoose.Schema({
  //乘车总人数
  m: String,
  //当前数据的时间
  date: String
});

const Amount = mongoose.model('Amount', amountSchema);
module.exports = Amount;
