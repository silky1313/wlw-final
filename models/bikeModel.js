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
  GPS: {
    type: String,
    require: [true, 'please give me your GPS']
  },
  RFID: {
    type: String,
    require: [true, 'please give me your RFID']
  },
  V1: {
    type: Number,
    require: [true, 'please give me your V1']
  },
  V2: {
    type: Number,
    require: [true, 'please give me your V2']
  },
  I: {
    type: Number,
    require: [true, 'please give me your I']
  },
  T: {
    type: Number,
    require: [true, 'please give me your T']
  },
  speed: {
    type: Number,
    require: [true, 'please give me your speed']
  }
});

const Bike = mongoose.model('Bike', bikeSchema);
module.exports = Bike;
