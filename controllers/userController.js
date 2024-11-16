const User = require('../models/user');
const jwt = require('jsonwebtoken');


const createUser = async (req, res) => {
    try {
        const {fname, lname, email, phone_number, password, role, address,image} = req.body;
        const user = new User({
            fname,
            lname,
            email,
            phone_number,
            password,
            role,
            address,
            image
        });

        const saveUser = await user.save();
        res.status(201).json({ message: 'User created successfully', data: saveUser });

    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
}



module.exports = {
    createUser,
    

}
