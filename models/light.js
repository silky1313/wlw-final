const mongoose = require('mongoose');

const lightSchema = new mongoose.Schema({
  l: String,
  //当前数据的时间
  date: String
});

const Light = mongoose.model('Light', lightSchema);
module.exports = Light;
