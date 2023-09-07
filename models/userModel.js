const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  date: String
});

const User = mongoose.model('User', userSchema);
module.exports = User;
