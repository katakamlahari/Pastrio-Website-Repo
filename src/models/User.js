const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, trim: true },
  passwordHash: { type: String, required: true },
}, { timestamps: true });

userSchema.methods.verifyPassword = function (password) {
  return bcrypt.compare(password, this.passwordHash);
};

userSchema.statics.createUser = async function (username, password) {
  const saltRounds = 10;
  const hash = await bcrypt.hash(password, saltRounds);
  return this.create({ username, passwordHash: hash });
};

const User = mongoose.model('User', userSchema);
module.exports = User;
