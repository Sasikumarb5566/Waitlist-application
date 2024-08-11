//Import required modules and libraries
const express = require('express');
const connectDB = require('./config/db/Connection'); //Import the database connection
const cors = require('cors'); // Middleware for enabling CORS (Cross-Origin Resource Sharing)
const bodyParser = require('body-parser'); // Middleware for parsing JSON and URL-encoded data
const port = process.env.PORT || 5051; // Define the server port
const app = express(); // Create an Express application
const otpRoutes = require('./routes/GenerateOtp')
const  loginVerify = require('./routes/GenerateOtp');
const  adminVerify = require('./routes/GenerateOtp');
const fetchUsers = require('./routes/FetchUsers');
const deleteAllUsers = require('./routes/AdminRoutes');
const addUser = require('./routes/AdminRoutes');
const deleteSingleUser = require('./routes/AdminRoutes');
const saveUser = require('./routes/AdminRoutes');
const googleLogin = require('./routes/GenerateOtp');
app.use(cors()); // Enable CORS for the entire application
app.use(bodyParser.json()); // Use JSON body parser
app.use(bodyParser.urlencoded({ extended: true })); // Use URL-encoded body parser

connectDB();//Use the Database

// Define routes for different parts of the application
app.use('/otp', otpRoutes);
app.use('/verify', loginVerify);
app.use('/fetch', fetchUsers);
app.use('/verify',adminVerify);
app.use('/delete', deleteAllUsers);
app.use('/add', addUser);
app.use('/delete', deleteSingleUser);
app.use('/users', saveUser);

// Start the server and listen on the defined port
app.listen(port, () => {
    console.log(`Server started at ${port}`); // Log that the server has started
  });