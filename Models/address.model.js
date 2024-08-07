const  mongoose  = require("mongoose");

const addresses = mongoose.Schema({
    customerId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer',
        required: true
    },
    address:{
        type: String,
        required: true
    },
});

module.exports = mongoose.model('Addresses', addresses);