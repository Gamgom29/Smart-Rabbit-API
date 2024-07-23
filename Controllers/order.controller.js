const Order = require('../Models/order.model.js');
const Customer = require('../Models/customer.model.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const asyncWrapper = require('../Middlewares/asyncWrapper');
const appError = require('../utils/appError.js');
const httpTextStatus = require('../utils/httpsStatusText.js');
const joi = require('joi');
const { ValidationError } = require('sequelize');

const getOrder = asyncWrapper(
    async (req,res,next)=>{
    console.log(req.params.id);
    const order = await Order.findByPk(req.params.id);
    if(!order){
        const error = appError.create('Order not found' , 404 ,httpTextStatus.FAIL );
        return next(error);
    }
    return res.status(200).json({status: httpTextStatus.SUCCESS, data:order});
    }
);
const orderSchema = joi.object({
    pickDate : joi.date().required(),
})
const CreateOrder = asyncWrapper(
    async (req,res,next)=>{
        const validation = orderSchema.validate(req.body);
        if(validation.error){
            return next(appError.create(validation.error.details[0].message, 400, httpTextStatus.FAIL));
        }
            const id = req.body.userId;
            const customer = await Customer.findByPk(id);
            if(!customer){
                return next(appError.create('User Not Found' , 404 , httpTextStatus.FAIL));
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


module.exports = {
    getOrder,
    CreateOrder
}