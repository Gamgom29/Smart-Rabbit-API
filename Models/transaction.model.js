const mongoose = require('mongoose');

const transactionShema = mongoose.Schema({
    customerId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer',
        required: true
    },
    walletId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Wallet',
        required: true
    },
    description:{
        type: String,
        required: true
    },
    amount:{
        type: Number,
        required: true
    }
});
module.exports = mongoose.model('Transaction',transactionShema);