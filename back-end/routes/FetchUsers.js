const express = require('express');
const { fetchAllUsers } = require('../controllers/FetchAllUser');
const router = express.Router();

router.post('/all-user', fetchAllUsers);

module.exports = router;