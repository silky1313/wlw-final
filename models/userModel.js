const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    require: [true, 'please give me your username']
  },
  password: {
    type: String,
    require: [true, 'please give me your password'],
    select: false
  }
});

const User = mongoose.model('User', userSchema);
module.exports = User;
