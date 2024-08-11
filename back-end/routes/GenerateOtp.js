const express = require('express');
const router = express.Router();
const { generateOtp, verifyOtp } = require('../controllers/OtpController');
const { loginVerify, adminVerify } = require('../controllers/LoginController');

router.post('/generate', generateOtp);// Route for generating OTP
router.post('/verify', verifyOtp);// Route for verifying OTP
router.post('/login', loginVerify); //Route for verifying login
router.post('/admin', adminVerify); //Route for verifying admin

module.exports = router;
