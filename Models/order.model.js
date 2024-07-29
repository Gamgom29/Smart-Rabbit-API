const mongoose = require('mongoose');
const validator = require('validator');
const order = mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer',
        required: true
    },
    pickDate:{
        type: Date,
        required: true
    },
    recieverName:{
        type: String,
        required: true
    },
    recieverCity:{
        type: String,
        required: true
    },
    recieverNeighborhood:{
        type: String,
        required: true
    },
    recieverStreet:{
        type: String,
        required: true
    },
    recieverPhone:{
        type: String,
        required: true,
    },
    productCategory:{
        type: String,
        required: true
    },
    quantity:{
        type: Number,
        required: true
    },
    notes:{
        type: String,
        required: false
    }
} , {timestamps: true });
module.exports = mongoose.model('Order',order);