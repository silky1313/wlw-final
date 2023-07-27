const mongoose = require('mongoose');

/*
"_id":,
"GPS":"(118.3E,44,6N)",
"V":27.5,
"I":10,
"T":30,
"speed":30
*/
const HbikeSchema = new mongoose.Schema({
  bike: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  }
});

const Hbike = mongoose.model('HBike', HbikeSchema);
module.exports = Hbike;
