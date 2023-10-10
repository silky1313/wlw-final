const mongoose = require('mongoose');

const tempSchema = new mongoose.Schema({
  t: String,
  //当前数据的时间
  date: String
});

const Temp = mongoose.model('Temp', tempSchema);
module.exports = Temp;
