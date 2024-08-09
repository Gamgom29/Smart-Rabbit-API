const transactionModel = require("../Models/transaction.model");
const asyncWrapper = require('../Middlewares/asyncWrapper');
const appError = require('../utils/appError.js');
const httpTextStatus = require('../utils/httpsStatusText.js');

const getTransaction = asyncWrapper(
    async(req,res,next)=>{
        const transactionId = req.params.id;
        const transaction = await transactionModel.findById(transactionId);
        if(!transaction)
            return next(appError.create('Transaction not found', 404, httpTextStatus.NOT_FOUND));
        res.status(200).json({
            status: httpTextStatus.SUCCESS,
            data: {transaction},
        });
    }
)

const getUserTransactions = asyncWrapper(
    async(req,res,next)=>{
        const customerId = req.currentUser;
        const transactions = await transactionModel.find({customerId});
        res.status(200).json({
            status: httpTextStatus.SUCCESS,
            data: {transactions},
        });
    }
);

module.exports={
    getTransaction,
    getUserTransactions,

}
