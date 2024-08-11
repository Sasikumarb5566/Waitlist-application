const User = require('../models/User');
const { updatePosition, generatePosition } = require('../services/PositionService');
const bcrypt = require("bcrypt");

module.exports.deleteAllUsers = async (req, res) => {
    try {
        const result = await User.deleteMany({});
        if(!result) {
          return res.json({ error: "User not found" });
        }
        res.json({ message: "User deleted successfully" });
      }
      catch(error) {
        res.json({ error: "Failed to delete user" });
      }
};

module.exports.addUser = async(req, res) => {
  const {username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.json({ success: false, message: "Missing fields" });
  }
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .json({ success: false, message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashedPassword, otp: "", otpExpiry: "" });
    await generatePosition(newUser);
    await newUser.save();
    await updatePosition();
    res.json({ success: true, message: "User added successfully" });
  } catch (error) {
    console.error("Error adding new user by admin: ", error);
    res.json({ success: false, message: "Error adding new user" });
  }
}

module.exports.deleteSingleUser = async(req, res) => {
  const {userId} = req.params;
  try {
    const user = await User.findByIdAndDelete(userId);
    if(!user) {
      return res.json({error: "Can't find the user"});
    }
    await updatePosition();
    res.json({success: true, message: "User deleted successfully"});
  }
  catch(error) {
    res.json({success: false, message: "can't able to delete user"});
  }
}

module.exports.saveUser = async(req, res) => {
  const {userId} = req.params;
  const { username, position, referrals} = req.body;
  try {
    const user = await User.findByIdAndUpdate(
      userId, 
      { username, position, referrals }, 
      { new: true }
  );
    if(!user) {
      return res.json({error: "Can't find the user"});
    }
    await updatePosition();
    res.json({success: true, message: "User updated successfully. Refresh the page..."});
  } catch(error) {
    res.json({success: false, message: "can't able to delete user"});
  }
}