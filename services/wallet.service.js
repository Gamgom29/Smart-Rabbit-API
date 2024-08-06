const Wallet = require('../Models/wallet.model');
const Transaction = require('../Models/transaction.model');

const addBalanceToWallet = async (walletId , amount) =>{
    try{
        const wallet =await Wallet.findById(walletId);
        console.log("WALLLET",wallet);
        let currentBalance = wallet.balance;
        currentBalance += amount;
        console.log(amount);
        wallet.balance = currentBalance;
        await wallet.save();
    }catch(err){
        throw err;
    }
}

const takeFromWallet = async (walletId , amount) =>{
    try{
        const wallet = await Wallet.findById(walletId);
        let currentBalance = wallet.balance;
        if(currentBalance < amount){
            const error =  new Error('Insufficient Balance');
            error.statusCode = 400;
            throw error;
        }
        currentBalance -= amount;
        wallet.balance = currentBalance;
        await wallet.save();
    }catch(err){
        throw err;
    }
}


module.exports ={
    addBalanceToWallet,
    takeFromWallet,
};
