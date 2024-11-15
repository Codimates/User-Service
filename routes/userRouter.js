const express = require('express');
const router = express.Router();

const { createUser } = require('../controllers/userController');

router.post('/createuser', createUser)

module.exports = router;