const express = require('express');
const router = express.Router();
const cors = require('cors');

// Updated CORS configuration
router.use(
    cors({
        credentials: true,
        origin: (origin, callback) => {
            const allowedOrigins = ['http://localhost:3000', 'http://localhost:3001', 'http://141.144.204.231:3000', /^http:\/\/.*:3000$/, /^http:\/\/.*:3001$/, '/ead3/'];
            if (allowedOrigins.includes(origin) || !origin) {
                callback(null, true);
            } else {
                callback(new Error('Not allowed by CORS'));
            }
        }
    })
);

// Importing controller functions
const { createUser } = require('../controllers/userController');
const { loginUser, logoutUser, getprofile, loginoparational } = require('../controllers/authController');

// Defining routes
router.post('/createuser', createUser);
router.post('/loginstaff',loginoparational)
router.get('/profile', getprofile);
router.post('/login', loginUser);
router.post('/logout', logoutUser);

module.exports = router;
