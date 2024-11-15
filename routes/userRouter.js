const express = require('express');
const router = express.Router();
const cors = require('cors');
router.use(
    cors({
        credentials: true,
        origin: 'http://localhost:3000'
    })
);

const { createUser } = require('../controllers/userController');
const { loginUser } = require('../controllers/authController')

router.post('/createuser', createUser)
router.post('/login',loginUser)

module.exports = router;