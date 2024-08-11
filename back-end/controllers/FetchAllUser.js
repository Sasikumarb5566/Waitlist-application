const User = require('../models/User');

// Fetch all users from Database
module.exports.fetchAllUsers = async (req, res) => {
    try {
        const users = await User.find().sort({ position: 1 });
        res.json({ success: true, message: "Fetched users successfully", data: users });
    } catch (error) {
        console.log("Error in fetching users in server: ", error);
        res.json({ success: false, message: "Failed to fetch users" });
    }
};
