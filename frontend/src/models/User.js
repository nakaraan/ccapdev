 const mongoose = require('mongoose');
 const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  phone: String,
  username: String,
  password: String,
  address: String,
  city: String,
  state: String,
  zip: String,
  country: String,
  newsletter: Boolean,
  referral: String,
 }, { timestamps: true });

 module.exports = mongoose.model('User', userSchema)