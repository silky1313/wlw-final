const mongoose = require('mongoose');

const testSchema = new mongoose.Schema({
  name: {
    type: String,
    require: [true, 'please give me your username']
  }
});

const Test = mongoose.model('Test', testSchema);
module.exports = Test;
