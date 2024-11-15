const User = require('../models/user');
const jwt = require('jsonwebtoken');
const { comparePassword } = require('../helpers/auth');

//login End Point
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        //check user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.json({
                error: 'no user found'
            });
        }

        //compare password
        const match = await comparePassword(password, user.password);
        if (match) {
            //return res.json('passwordmatch');
            jwt.sign({ id: user._id }, process.env.REACT_APP_JWT_SECRET, {}, (err, token) => {
                if (err) throw err;
                res.cookie('token', token).json(user);
            });
        } else {
            return res.json({ error: 'Incorrect password' });
        }

    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Server Error' });
    }
};

module.exports = {
    loginUser
};
