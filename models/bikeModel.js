const mongoose = require('mongoose');

/*
"_id":,
"GPS":"(118.3E,44,6N)",
"V":27.5,
"I":10,
"T":30,
"speed":30
*/
const bikeSchema = new mongoose.Schema({
  id: String,
  t: String,
  l: String,
  s: String,
  a: String,
  date: String,
  min: String,
  max: String
});

const Bike = mongoose.model('Bike', bikeSchema);
module.exports = Bike;
