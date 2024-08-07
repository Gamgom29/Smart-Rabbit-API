const mongoose = require('mongoose');
const validator = require('validator');
const crypto = require('crypto');
const customer = new mongoose.Schema({
    name : {
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique: true,
        validate: [validator.isEmail, 'Invalid email address']
    },
    phone:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true,
    },
    nationalId:{
        type: Number,
        required: true,
        unique: true
    },
    nationalIdPhotoFace:{
        type: String,
        required: true,
        default: 'photo'
    },
    nationalIdPhotoBack:{
        type: String,
        required: true,
        default: 'photo'
    },
    taxNumberPhoto:{
        type: String,
        required: true,
        default: 'photo'
    },
    taxNumber:{
        type: Number,
        required: true,
        unique: true
    },
    addresses:[{
        type: mongoose.Schema.ObjectId,
        ref : 'Addresses'
    }],
    productType:{
        type: String,
        required: true
    },
    token:{
        type: String
    },
    OTP:String,
    OTPExp:Date
});
customer.methods.generateOTP = function(){
    const Otp = crypto.randomInt(100000,999999).toString();
    this.OTP = Otp;
    this.OTPExp = Date.now() + 10 * 60 * 1000; // 10 minutes
    return Otp;
}
module.exports = mongoose.model('Customer', customer);