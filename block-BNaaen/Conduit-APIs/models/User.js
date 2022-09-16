const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;
const jwt = require('jsonwebtoken');
require('dotenv').config()

const userSchema = new Schema(
  {
    username: { type: String, required: true, unique: true},
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, minlength: 5, required: true },
    token: { type: String },
    bio: { type: String },
    image: { type: String },
    articles: [{ type: Schema.Types.ObjectId, ref: "Article" }], 
    favorites: [{ type: Schema.Types.ObjectId, ref: "Article" }],
    followers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    following: [{ type: Schema.Types.ObjectId, ref: 'User' }]
  },
  { timestamps: true }
);

// Hashing the password
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

//Method for verification of Password
userSchema.methods.verifyPassword = async function (password) {
  try {
    var result = await bcrypt.compare(password, this.password);
    console.log(result);
    return result;
  } catch (error) {
    return error;
  }
  bcrypt.compare();
};

// Method for signing the token
userSchema.methods.signToken = async function(){
    console.log(this);
    var payload = { userId: this.id, email: this.email};
    try{
        var token = await jwt.sign(payload, process.env.SECRET);
        return token;
    } catch (error) {
        return error;
    }
}
// Method to make userJSON data
userSchema.methods.userJSON = function(token){
    return {
        username: this.username,
        email: this.email,
        bio: this.bio,
        image: this.image,
        token: token
    }
}

// // Method to display User
// userSchema.methods.displayUser = function (id = null) {
//     return {
//       name: this.name,
//       username: this.username,
//       bio: this.bio,
//       avatar: this.avatar,
//       following: id ? this.followersList.includes(id) : false,
//     };
// };

module.exports = mongoose.model('User', userSchema);