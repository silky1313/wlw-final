const mongoose = require('mongoose');

const sleepSchema = new mongoose.Schema({
  sleep: String,
  date: String
});

const Sleep = mongoose.model('Sleep', sleepSchema);
module.exports = Sleep;
