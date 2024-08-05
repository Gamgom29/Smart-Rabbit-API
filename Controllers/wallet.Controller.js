const Wallet = require('../Models/wallet.model');
const asyncWrapper = require('../Middlewares/asyncWrapper');
const appError = require('../utils/appError');
const httpTextStatus = require('../utils/httpsStatusText');
const walletService = require('../services/wallet.service');
const Order = require('../Models/order.model');
const httpsStatusText = require('../utils/httpsStatusText');

const getWallet = asyncWrapper(
    async(req,res,next)=>{
        const customerId = req.params.id;
        console.log(customerId);
        const wallet = await Wallet.findOne({customerId: customerId});
        if(!wallet){
            return next(appError.create('Cann\'t Find Wallet', 404, httpTextStatus.FAIL));
        }
        res.status(200).json({status:httpTextStatus.SUCCESS, data:{wallet}});
    }
);

const payWithWallet = asyncWrapper(
    async(req , res , next) =>{
        const orderId = req.params.id;
        const order = await Order.findById(orderId);
        console.log(order.customerId);
        
        const wallet = await Wallet.findOne({customerId:order.customerId});
        if(!wallet){
            return res.status(404).json({status: httpsStatusText.FAIL, message: 'Wallet Not Found'});
        }
        walletService.takeFromWallet(wallet._id , order.orderPrice);
        order.paymentStatus = 'Paid';
        await order.save();
        res.status(200).json({status: httpsStatusText.SUCCESS, message: 'Payment with wallet successful'});
    }
);
module.exports ={
    getWallet,
    payWithWallet
}