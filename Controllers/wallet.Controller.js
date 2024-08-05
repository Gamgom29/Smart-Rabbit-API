const Wallet = require('../Models/wallet.model');
const asyncWrapper = require('../Middlewares/asyncWrapper');
const appError = require('../utils/appError');
const httpTextStatus = require('../utils/httpsStatusText');

const getWallet = asyncWrapper(
    async(req,res,next)=>{
        const customerId = req.body.customerId;
        console.log(customerId);
        const wallet = await Wallet.findOne({customerId: customerId});
        if(!wallet){
            return next(appError.create('Cann\'t Find Wallet', 404, httpTextStatus.FAIL));
        }
        res.status(200).json({status:httpTextStatus.SUCCESS, data:{wallet}});
    }
);

module.exports ={
    getWallet
}