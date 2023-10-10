const mongoose = require('mongoose');

const cfSchema = new mongoose.Schema({
  cf: String,
  date: String
});

const Cf = mongoose.model('Cf', cfSchema);
module.exports = Cf;
