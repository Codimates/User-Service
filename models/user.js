const mongoose = require('mongoose');
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
        required:true,
        default:'customer'
    },
    address:{
        type:String,
        required:true
    }
},{timestamps:true});
const User = mongoose.model('User', userSchema);
module.exports = User;
