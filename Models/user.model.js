const mongoose = require('mongoose');

const user = mongoose.Schema({
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
        enum: ['admin', 'moderator'],
        default: 'admin'
    }
});

module.exports = mongoose.model('User', user);