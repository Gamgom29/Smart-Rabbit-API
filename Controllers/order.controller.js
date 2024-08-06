const Order = require('../Models/order.model.js');
const Customer = require('../Models/customer.model.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const asyncWrapper = require('../Middlewares/asyncWrapper');
const appError = require('../utils/appError.js');
const httpTextStatus = require('../utils/httpsStatusText.js');
const Transaction = require('../Models/transaction.model.js');
const Wallet = require('../Models/wallet.model.js');
const walletService = require('../services/wallet.service.js');

const getOrder = asyncWrapper(
    async (req,res,next)=>{
    console.log(req.params.id);
    const order = await Order.findById(req.params.id);
    if(!order){
        const error = appError.create('Order not found' , 404 ,httpTextStatus.FAIL );
        return next(error);
    }
    return res.status(200).json({status: httpTextStatus.SUCCESS, data:order});
    
}
);

const CreateOrder = asyncWrapper(
    async (req,res,next)=>{
            const id = req.body.customerId;
            const customer = await Customer.findById(id);
            if(!customer){
                return next(appError.create('No User To Create Order ' , 404 , httpTextStatus.FAIL));
            }
            const order = await Order.create(req.body);
            if(!order){
                const error = appError.create('Failed to create Order' , 500 , httpTextStatus.FAIL );
                return next(error);
            }
            order.save();
            return res.status(201).json({status: httpTextStatus.SUCCESS, data:{order}});
    }
);
const getAllOrders = asyncWrapper(
    async (req,res,next)=>{
        const userid =await req.params.id;
        console.log(req.params.id);
        const orders = await Order.find({customerId: userid});
        if(!orders){
            return next(appError.create('Invalid user ID ' , 404 , httpTextStatus.ERROR));
        }
        return res.status(200).json({status: httpTextStatus.SUCCESS, data:{orders}});
    }

);
const deleteOrder = asyncWrapper(
    async (req,res,next)=>{
        const order = await Order.findByIdAndDelete(req.params.id);
        if(!order){
            const error = appError.create('Order not found' , 404 , httpTextStatus.FAIL );
            return next(error);
        }
        return res.status(200).json({status: httpTextStatus.SUCCESS, data:null });
    }

);

const changeOrderPaymentStatus = asyncWrapper(
    async (req,res,next)=>{
        const order = await Order.findByIdAndUpdate(req.params.id, req.body, {new: true});
        if(!order){
            const error = appError.create('Order not found' , 404 , httpTextStatus.FAIL );
            return next(error);
        }
        return res.status(200).json({status: httpTextStatus.SUCCESS, data:order});
    }
);

const changeOrderState = asyncWrapper(
    async(req,res,next)=>{
        const orderId = req.params.id;
        const order = await Order.findById(orderId);
        const orderStatus = req.body.orderStatus;
        if(!order){
            const error = appError.create('Order not found' , 404 , httpTextStatus.FAIL );
            return next(error);
        }
        order.orderStatus = orderStatus;
        if(order.paymentMethod =='Cash' && order.cashHandlingType =='total' && order.orderStatus == 'Complete'){
            let customerId = order.customerId;
            let wallet = await Wallet.findOne({customerId: customerId});
            let customer = await Customer.findById(customerId);
            let transaction = await Transaction.create({
                customerId,
                walletId : wallet._id,
                amount:order.orderPrice,
                description:`Order From ${customer.name} has arrived and money sent to him`
            });
            order.paymentStatus='Paid';
            await walletService.addBalanceToWallet(wallet._id , order.orderPrice);
            transaction.save();
            order.save();
            return res.status(200).json({status: httpTextStatus.SUCCESS, data:{order} , message:'Order Status Changed and money transfered to Store'});
        }
        else if(order.orderStatus =='Complete') order.paymentStatus='Paid';
        else if(order.orderStatus =='Cancelled')order.paymentStatus=order.orderStatus;
        order.save();
        return res.status(200).json({status: httpTextStatus.SUCCESS, data:order});
    }
);

const createOrderPayWithWallet = asyncWrapper(
    async(req,res,next)=>{
        const id = req.body.customerId;
            const customer = await Customer.findById(id);
            if(!customer){
                return next(appError.create('No User To Create Order ' , 404 , httpTextStatus.FAIL));
            }
            const order = await Order.create(req.body);
            if(!order){
                const error = appError.create('Failed to create Order' , 500 , httpTextStatus.FAIL );
                return next(error);
            }
            const wallet = await Wallet.findOne({customerId: id});
            if(!wallet){
                const error = appError.create('No Wallet Found' , 404 , httpTextStatus.FAIL );
                return next(error);
            }
            try{
                await walletService.takeFromWallet(wallet._id , order.total);
                order.paymentStatus = 'Paid';
                await order.save();
                return res.status(201).json({status: httpTextStatus.SUCCESS, data:{order}});
            }catch(err){
                if(err.message ==='Insufficient Balance')
                    return res.status(400).json({ status: httpTextStatus.FAIL, message: err.message });
                
                const error = appError.create('Failed to pay order with wallet', 500, httpTextStatus.FAIL);
                return next(error);
            }
            
    }
);

module.exports = {
    getOrder,
    CreateOrder,
    getAllOrders,
    deleteOrder,
    changeOrderState,
    createOrderPayWithWallet
}