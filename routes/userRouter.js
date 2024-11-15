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
const { loginUser, logoutUser, getprofile } = require('../controllers/authController')

router.post('/createuser', createUser)
router.get('/profile',getprofile)

router.post('/login',loginUser)
router.post('/logout',logoutUser)

module.exports = router;