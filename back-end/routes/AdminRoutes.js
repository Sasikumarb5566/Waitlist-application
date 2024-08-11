const express = require('express');
const { deleteAllUsers, addUser, deleteSingleUser, saveUser } = require('../controllers/AdminController');
const router = express.Router();

router.delete('/all-user', deleteAllUsers);
router.post('/user', addUser);
router.delete('/single-user/:userId', deleteSingleUser);
router.put('/add/:userId', saveUser);

module.exports = router;