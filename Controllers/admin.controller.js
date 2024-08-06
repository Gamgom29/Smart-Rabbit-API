const Admin = require('../Models/admin.model');
const asyncWrapper = require('../Middlewares/asyncWrapper');
const appError = require('../utils/appError');
const jwt =require('jsonwebtoken');
const bcrypt = require('bcrypt');
const httpTextStatus = require('../utils/httpsStatusText.js');
const Order = require('../Models/order.model.js');
const Customer = require('../Models/customer.model.js');

const createAdmin = asyncWrapper(
    async (req, res, next) => {
        const email = req.body.email;
        const oldAdmin = await Admin.findOne({email});
        if(oldAdmin)
            return next(appError.create('Admin already exists', 400, httpTextStatus.FAIL));
        const hashedPassword = await bcrypt.hash(req.body.password , 10);
        const admin = await Admin.create({
            username: req.body.userName,
            email:req.body.email,
            role:req.body.role,
            password: hashedPassword,
        });
        if(!admin){
            return next( appError.create('Failed to create admin', 500, httpTextStatus.FAIL));
        }
        return res.status(201).json({status: httpTextStatus.SUCCESS, data: {admin} });
    }
);
const login = asyncWrapper(
    async (req, res, next) => {
        const {email, password} = req.body;
        const admin = await Admin.findOne({email});
        if(!admin){
            return next(appError.create('Admin not found', 404, httpTextStatus.FAIL));
        }
        const isMatch = await bcrypt.compare(password, admin.password);
        if(!isMatch){
            return next(appError.create('Invalid email or password', 401, httpTextStatus.FAIL));
        }
        const token = jwt.sign({email:admin.email , username:admin.username , role:admin.role} ,
                                    process.env.JWT_SECRET,{expiresIn:process.env.JWT_EXPIRE});
        return res.status(201).json({status: httpTextStatus.SUCCESS, data: {
            admin:{
                username:admin.username,
                email:admin.email,
                role:admin.role,
                createdAt:admin.createdAt,
                updatedAt:admin.updatedAt,
            },
            token
        } });
        
    }
);

const getAllOrders = asyncWrapper(
    async (req, res, next) => {
        const limit = req.query.limit || 10;
        const page = req.query.page || 1;
        //const skip = (page - 1) * limit;
        const orders = await Order.find({} , {__v:false});
        if(!orders)
            return next(appError.create('No orders found', 404, httpTextStatus.FAIL));
        console.log(orders.length);
        return res.status(200).json({status: httpTextStatus.SUCCESS, data: {
            orders:orders.slice(page * limit - limit , page* limit),
            pagination: {
                page,
                limit,
                totalCount: orders.length,
                totalPages: Math.ceil(orders.length / limit),
            }
        }});
    }
);

const getAllCustomers = asyncWrapper(
    async (req, res, next) => {
        const limit = req.query.limit || 10;
        const page = req.query.page || 1;
        const customers = await Customer.find({}, {__v:false , password:false,
            token:false , nationalIdPhotoBack:false , nationalIdPhotoFace:false , taxNumberPhoto:false});
        if(!customers)
            return next(appError.create('No customers found', 404, httpTextStatus.FAIL));

        return res.status(200).json({status: httpTextStatus.SUCCESS, data: {
            customers:customers.slice(page*limit - limit , page*limit),
            pagination: {
                page,
                limit,
                totalCount: customers.length,
                totalPages: Math.ceil(customers.length / limit),
            }
        }});
    }
)

module.exports = {
    createAdmin,
    login,
    getAllOrders,
    getAllCustomers
}