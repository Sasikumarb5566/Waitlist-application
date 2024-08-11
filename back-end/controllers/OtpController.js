const User = require("../models/User");
const { sendEmail } = require("../helpers/Email");
const uniqueLink = require("../services/GenerateUniqueLink");
const bcrypt = require("bcrypt");
const { generatePosition, updatePosition } = require("../services/PositionService");

module.exports.generateOtp = async (req, res) => {
  const { username, email, password } = req.body;
  const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiry = new Date(Date.now() + 10 * 60 * 1000);

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.json({ success: false, message: "Email already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      otp: generatedOtp,
      otpExpiry: expiry,
    });

    await newUser.save();
    await sendEmail(email, "Your OTP Code", `Your OTP code is ${generatedOtp}`);
    return res.json({
      success: true,
      message: "OTP sent to your email address!",
    });
  } catch (error) {
    console.error("Error details:", error);
    return res
      .status(500)
      .json({ success: false, message: `Error: ${error.message}` });
  }
};

module.exports.verifyOtp = async (req, res) => {
  const { email, otp, inviter } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }
    if (user.otp !== otp) {
      return res.json({ success: false, message: "Invalid OTP" });
    }

    if (new Date() > user.otpExpiry) {
      await User.deleteOne({ email });
      return res.json({ success: false, message: "OTP expired" });
    }

    user.otp = null;
    user.otpExpiry = null;
    const link = uniqueLink();
    user.referralLink = link;

    await generatePosition(user);

    if (inviter) {
      user.inviter = inviter;
      const inviteFrom = await User.findOne({ referralLink: inviter });
      if (inviteFrom) {
        inviteFrom.referrals++;
        inviteFrom.position = (inviteFrom.position || 99) - 1;
        await inviteFrom.save();
      }
    }

    await user.save();
    await updatePosition();

    const firstPositionUser = await User.findOne({ position: 1 });
    if (firstPositionUser) {
      console.log(firstPositionUser.email);
      await sendEmail(
        firstPositionUser.email,
        "Congratulations!",
        "You have reached Position 1. Here is your coupon code: COUPON123"
      );
    }

    res.json({ success: true, message: "OTP verified successfully" });
  } catch (error) {
    console.error("Error details:", error);
    res
      .status(500)
      .json({ success: false, message: `Error: ${error.message}` });
  }
};
