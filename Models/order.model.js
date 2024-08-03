const mongoose = require('mongoose');
const validator = require('validator');
const order = mongoose.Schema({
    customerId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer',
        required: true
    },
    pickupAddress:{
        type: String,
        required: true
    },
    pickupDate:{
        type: Date,
        required: true
    },
    storePhoneNumber:{
        type: String,
        required: true
    },
    productCategory:{
        type: String,
        required: true
    },
    quantity:{
        type: Number,
        required: true
    },
    receiverName:{
        type: String,
        required: true
    },
    receiverPhoneNumber:{
        type: String,
        required: true
    },
    receiverAddress:{
        type: String,
        required: true
    },
    orderPrice:{
        type: Number,
        required: true
    },
    receiveDate:{
        type: Date,
        required: true
    },
    paymentMethod:{
        type: String,
        required: true,
        enum:['Cash', 'Visa'],
        default: 'Cash'
    },
    cashHandlingType:{
        type: String,
        enum: ['total', 'delivery'],
    },
    paymentStatus:{
        type: String,
        required: false,
        enum:['Pending' , 'Paid' , 'Cancelled'],
        default: 'Pending'
    },
    orderStatus:{
        type: String,
        required: false,
        enum:['Pending' , 'Shipped' , 'Complete' , 'Cancelled' , ],
        default: 'Pending',
    },
    notes:{
        type: String,
        required: false,
        default: ''
    },
} , {timestamps: true });
module.exports = mongoose.model('Order',order);