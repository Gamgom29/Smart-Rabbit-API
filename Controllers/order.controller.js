const Order = require('../Models/order.model.js');
const Customer = require('../Models/customer.model.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const asyncWrapper = require('../Middlewares/asyncWrapper');
const appError = require('../utils/appError.js');
const httpTextStatus = require('../utils/httpsStatusText.js');
const joi = require('joi');
const { ValidationError } = require('sequelize');
const googleKey = process.env.GOOGLE_API_KEY;


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
            const id = req.body.userId;
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
)
const getAllOrders = asyncWrapper(
    async (req,res,next)=>{
        const userid =await req.params.id;
        console.log(req.params.id);
        const orders = await Order.find({userId: userid});
        if(!orders){
            return next(appError.create('Invalid user ID ' , 404 , httpTextStatus.ERROR));
        }
        return res.status(200).json({status: httpTextStatus.SUCCESS, data:{orders}});
    }

)
const deleteOrder = asyncWrapper(
    async (req,res,next)=>{
        const order = await Order.findByIdAndDelete(req.params.id);
        if(!order){
            const error = appError.create('Order not found' , 404 , httpTextStatus.FAIL );
            return next(error);
        }
        return res.status(200).json({status: httpTextStatus.SUCCESS, data:null });
    }

)

module.exports = {
    getOrder,
    CreateOrder,
    getAllOrders,
    deleteOrder
}