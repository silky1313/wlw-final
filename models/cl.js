const mongoose = require('mongoose');

const clSchema = new mongoose.Schema({
  //小灯状态 00 -11
  cl: String,
  date: String
});

const Cl = mongoose.model('Cl', clSchema);
module.exports = Cl;
