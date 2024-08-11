const express = require('express');
const { deleteAllUsers, addUser, deleteSingleUser, saveUser } = require('../controllers/AdminController');
const router = express.Router();

router.delete('/all-user', deleteAllUsers); // Route for deleting all users
router.post('/user', addUser); // Route for add a user
router.delete('/single-user/:userId', deleteSingleUser); // Route for delete single user
router.put('/add/:userId', saveUser); // Route for update user

module.exports = router;