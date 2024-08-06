const mongoose = require('mongoose');
const validator = require('validator');
const userRoles = require('../utils/userRoles');
const admin = mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: [validator.isEmail, 'Invalid email address']
    },
    role: {
        type: String,
        enum: [userRoles.ADMIN, userRoles.MODERATOR],
        default:userRoles.ADMIN
    }
});

module.exports = mongoose.model('Admin', admin);