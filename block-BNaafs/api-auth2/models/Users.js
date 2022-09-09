const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config()
const Schema = mongoose.Schema;

var userSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, minlength: 5, required: true },
  },
  { timestamps: true }
);

userSchema.pre('save', async function (next) {
  if (this.password && this.isModified('password')) {
    try {
      this.password = await bcrypt.hash(this.password, 10);
    } catch (error) {
      return error;
    }
  }
  next();
});

userSchema.methods.verifyPassword = async function (password) {
  try {
    var result = await bcrypt.compare(password, this.password);
    return result;
  } catch (error) {
    return error;
  }
  bcrypt.compare();
};

userSchema.methods.signToken = async function(){
    var payload = { userId: this.id, email: this.email };
    try {
        var token = await jwt.sign(payload, process.env.SECRET);
        return token;
    } catch (error){
        return error;
    }
}

userSchema.methods.userJSON = function(token){
  return {
    name: this.name,
    email: this.email,
    token: token
  }
}

module.exports = mongoose.model('User', userSchema);