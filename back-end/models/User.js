const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  referralLink: String,
  inviter: String,
  referrals: { type: Number, default: 0 },
  otp: String,
  otpExpiry: Date,
  position: { type: Number, default: 98 },
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

module.exports = User;
