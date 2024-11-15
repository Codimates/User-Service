const User = require('../models/user');

const createUser = async (req, res) => {
    try {
        const {fname, lname, email, phone_number, password, role, address} = req.body;
        const user = new User({
            fname,
            lname,
            email,
            phone_number,
            password,
            role,
            address
        });

        const saveUser = await user.save();
        res.status(201).json({ message: 'User created successfully', data: saveUser });

    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
}

module.exports = {
    createUser

}
