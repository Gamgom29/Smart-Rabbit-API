const mongoose = require('mongoose');
const validator = require('validator');
const driver = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true,
        unique: true
    },
    vehicle: {
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique: true,
        validate: [validator.isEmail, 'Invalid email address']
    },
    password:{
        type: String,
        required: true,
    },
    availability: {
        type: Boolean,
        required: false,
        default: true
    },
    nationalId:{
        type: String,
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
    license:{
        type: String,
        required: true,
        unique: true
    },
    role:{
        type: String,
        enum: ['Pickup', 'Delivery' , 'Pickup/Delivery'],
        default: 'Pickup/Delivery'
    },
    token:{
        type: String,
        required: false
    }
});

module.exports = mongoose.model('Driver', driver);