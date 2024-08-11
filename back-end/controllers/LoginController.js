const User = require('../models/User');
const Admin = require('../models/Admin');
const bcrypt = require("bcrypt");

// User's email and password verification from login page
module.exports.loginVerify = async(req, res) => {
    const { email, password } = req.body;
    try {
        const existingUser = await User.findOne({email});
        if(existingUser && await bcrypt.compare(password, existingUser.password)) {
            return res.json({success: true, message: "Login successfully"});
        }
        else {
            return res.json({success: false, message: "Invalid email or password"});
        }
    }
    catch(error) {
        console.log("Error in verifying login: ",error);
        return res.json({success: false, message: `Error: ${error.message}`})
    }
}

// Admin's email and password verification from admin-login page
module.exports.adminVerify = async(req, res) => {
    const { email, password } = req.body;
    try {
        const existingUser = await Admin.findOne({email});
        if(existingUser && await bcrypt.compare(password, existingUser.password)) {
            return res.json({success: true, message: "Login successfully"});
        }
        else {
            return res.json({success: false, message: "Invalid email or password"});
        }
    }
    catch(error) {
        console.log("Error in verifying login: ",error);
        return res.json({success: false, message: `Error: ${error.message}`})
    }
}
