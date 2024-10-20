const mongoose = require('mongoose');
const bcrypt = require('bcrypt')

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: false
  },
  password: {
    type: String,
    required: true
  },
  score: {
    type: Number,
    default: 0
  }
});

UserSchema.methods.comparePassword = async function (canditatePassword) {
  // const isMatch = await bcrypt.compare(canditatePassword, this.password);
  const isMatch = canditatePassword == this.password
  console.log('Passwords match status is', isMatch)
  // console.log('Actual Password: ',  this.password)
  // console.log('Candidate Password: ', canditatePassword)
  return isMatch;
};

module.exports = mongoose.model('User', UserSchema);
