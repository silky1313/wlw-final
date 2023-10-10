const mongoose = require('mongoose');

// 存储c
const peopleSchema = new mongoose.Schema({
  //人员数量信息
  p: String,
  date: String
});

const People = mongoose.model('People', peopleSchema);
module.exports = People;
