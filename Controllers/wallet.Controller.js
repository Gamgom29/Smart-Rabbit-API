const Wallet = require('../Models/wallet.model');
const asyncWrapper = require('../Middlewares/asyncWrapper');
const appError = require('../utils/appError');
const httpTextStatus = require('../utils/httpsStatusText');
const walletService = require('../services/wallet.service');
const Order = require('../Models/order.model');
const companyService = require('../services/company.service');
const Withdraw = require('../Models/withDraw.model');

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
            return res.status(404).json({status: httpTextStatus.FAIL, message: 'Wallet Not Found'});
        }
        walletService.takeFromWallet(wallet._id , order.shippingPrice);
        order.paymentStatus = 'Paid';
        const company = companyService.getInstance();
        companyService.updateCompany({
            treasury: company.treasury + order.shippingPrice
        });
        await order.save();
        res.status(200).json({status: httpTextStatus.SUCCESS, message: 'Payment with wallet successful'});
    }
);

const withDraw = asyncWrapper(
    async(req,res,next)=>{
        let token = req.headers['Authorization'] || req.headers['authorization'];
            token = token.split(' ')[1];
            const decodeToken = jwt.decode(token , process.env.JWT_SECRET);
            let customerId = decodeToken.id;
            const wallet = await Wallet.findOne({customerId: customerId});
            if(!wallet) 
                return res.status(404).json({status: httpTextStatus.FAIL, message: 'User Not Found'});
            
            const withdraw = await Withdraw.create({
                customerId: customerId,
                amount: wallet.balance,
                walletId: wallet._id
            });
            res.status(200).json({status:httpTextStatus.SUCCESS , data:{withdraw} , message:'Wtih Draw Request Created Successfully'});
    }
)
module.exports ={
    getWallet,
    payWithWallet,
    withDraw
}