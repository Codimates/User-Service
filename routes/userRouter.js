const express = require('express');
const router = express.Router();
const cors = require('cors');

// Updated CORS configuration
router.use(
    cors()
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
