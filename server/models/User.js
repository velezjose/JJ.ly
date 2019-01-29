const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
  firstName: {
    type: String,
    default: '',
  },
  lastName: {
    type: String,
    default: '',
  },
  email: {
    type: String,
    default: '',
  },
  password: {
    type: String,
    default: '',
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
});

// bcrypt library generates user's hashed password
UserSchema.methods.generateHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
// hashes password and returns if it === hashedPasswd
UserSchema.methods.validPassword = (password, hashedPasswd) => bcrypt.compareSync(password, hashedPasswd);

module.exports = mongoose.model('User', UserSchema);
