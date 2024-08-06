const mongoose = require('mongoose');

const company = mongoose.Schema({
    shippingPrice:{
        type: Number,
        required: true,
        default: 0,
    },
    treasury:{
        type: Number,
        required: true,
        default: 0,
    },
});

module.exports = mongoose.model('Company', company);