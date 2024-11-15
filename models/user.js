const mongoose = require('mongoose');
const { hashPassword } = require('../helpers/auth');
const userSchema = new mongoose.Schema({
    fname:{
        type:String,
        required:true
    },
    lname:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    phone_number:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    role:{
        type:String,
        default:'customer'
    },
    address:{
        type:String,
        required:false
    }
}, { timestamps: true });
userSchema.pre('save', async function(next) {
    if (this.isModified('password')) {
        this.password = await hashPassword(this.password);
    }
    next();
});
const User = mongoose.model('User', userSchema);
module.exports = User;
