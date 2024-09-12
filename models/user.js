const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true }, // เพิ่มฟิลด์ email
  password: { type: String, required: true },
});

module.exports = mongoose.model('User', UserSchema);
