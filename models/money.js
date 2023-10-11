const mongoose = require('mongoose');

const mongySchema = new mongoose.Schema({
  l: String,
  //当前数据的时间
  date: String
});

const Money = mongoose.model('Money', mongySchema);
module.exports = Money;
