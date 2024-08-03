const mongoose = require('mongoose');
const walletSchema =new mongoose.createSchema({
    customerId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer',
        required: true
    },
    balance:{
        type: Number,
        default: 0
    }
});
module.exports = mongoose.model('Wallet',walletSchema);