const mongoose = require('mongoose');
const walletSchema = mongoose.Schema({
    customerId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer',
        required: true,
        unique: true
    },
    balance:{
        type: Number,
        default: 0
    }
});
module.exports = mongoose.model('Wallet',walletSchema);