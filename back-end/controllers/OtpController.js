const User = require("../models/User");
const { sendEmail } = require("../helpers/Email");
const uniqueLink = require("../services/GenerateUniqueLink");
const bcrypt = require("bcrypt");
const { generatePosition, updatePosition } = require("../services/PositionService");

// Generate OTP for newly signup user
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
    const newUser = new User({      // Create a new user temporarily for OTP verification
      username,
      email,
      password: hashedPassword,
      otp: generatedOtp,
      otpExpiry: expiry,
    });

    await newUser.save();
    await sendEmail(email, "Your OTP Code", `Your OTP code is ${generatedOtp}`); // Call sendMail function to send OTP
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

// OTP verification from signup page
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
      await User.deleteOne({ email });      // If OTP is timed out, then automatically delete the user from the database
      return res.json({ success: false, message: "OTP expired" });
    }

    user.otp = null;
    user.otpExpiry = null;
    const link = uniqueLink();
    user.referralLink = link;

    await generatePosition(user); // Call the generatePosition function

    if (inviter) {
      // If someone signup using someone's referral link, the inviter position and referrals count will be updated
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
    // Permanently store the user in database
    const firstPositionUser = await User.findOne({ position: 1 }); // Check whether someone attain the position 1
    if (firstPositionUser) {
      await sendEmail( // Send email to user who achieve position 1
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
