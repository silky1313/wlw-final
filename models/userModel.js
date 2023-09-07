const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String }, //用户账号
  userpwd: { type: String }, //密码
  userage: { type: Number }, //年龄
  logindate: { type: Date }
});

const User = mongoose.model('User', userSchema);
module.exports = User;
