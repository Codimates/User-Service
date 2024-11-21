const User = require('../models/user');
const jwt = require('jsonwebtoken');
const { comparePassword } = require('../helpers/auth');

//login end point
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.json({
                error: 'No user found'
            });
        }

        // Compare passwords
        const match = await comparePassword(password, user.password);
        if (match) {
            //return res.json('Password match');
            jwt.sign({ id: user._id,fname: user.fname, lname: user.lname , role : user.role  },process.env.REACT_APP_JWT_SECRET, {}, (err,token) => {
                if(err) throw err;
                res.cookie('token',token).json(user)
            })
        } else {
            return res.json({ error: 'Incorrect password' });
        }

    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Server error' });
    }
};

//login only admin sales manager, inventory manager
const loginoparational = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Define allowed roles
        const allowedRoles = ['admin', 'inventorymanager', 'productmanager', 'salesmanager'];

        // Check if user exists and has an allowed role
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({
                error: 'No user found'
            });
        }

        // Validate user role
        if (!allowedRoles.includes(user.role)) {
            return res.status(403).json({
                error: 'Unauthorized access: Invalid role'
            });
        }

        // Compare passwords
        const match = await comparePassword(password, user.password);
        if (match) {
            // Generate JWT token with user information
            jwt.sign(
                { 
                    id: user._id,
                    fname: user.fname, 
                    lname: user.lname, 
                    role: user.role 
                },
                process.env.REACT_APP_JWT_SECRET, 
                { expiresIn: '1h' }, // Optional: add token expiration
                (err, token) => {
                    if (err) throw err;
                    res.cookie('token', token, {
                        httpOnly: true, // Improve security
                        secure: process.env.NODE_ENV === 'production' // Use secure in production
                    }).json({
                        id: user._id,
                        fname: user.fname,
                        lname: user.lname,
                        role: user.role
                    });
                }
            );
        } else {
            return res.status(401).json({ error: 'Incorrect password' });
        }
    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({ error: 'Server error' });
    }
};

// Get Profile Endpoint
const getprofile = (req, res) => {
    const { token } = req.cookies;

    if (!token) {
        return res.status(401).json({ error: 'No token provided' });
    }

    jwt.verify(token, process.env.REACT_APP_JWT_SECRET, {}, (err, decoded) => {
        if (err) {
            console.error('Token verification error:', err);
            return res.status(401).json({ error: 'Invalid token' });
        }

        // Find user by id
        User.findById(decoded.id)
            .then(user => {
                if (!user) {
                    return res.status(404).json({ error: 'User not found' });
                }

                // Build user profile response
                const userProfile = {
                    email: user.email,
                    _id: user._id,
                    fname: user.fname,
                    lname: user.lname,
                    role: user.role,
                    phone_number: user.phone_number,
                    address: user.address,
                };

                res.json(userProfile);
            })
            .catch(error => {
                console.error('Error finding user:', error);
                res.status(500).json({ error: 'Server error' });
            });
    });
};


// Logout Endpoint
const logoutUser = (req, res) => {
    res.clearCookie('token');
    res.status(200).json({ message: 'Logout successful' });
};

module.exports = {
    loginUser,
    getprofile,
    logoutUser,
    loginoparational
};
