const Customer = require('../Models/customer.model.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const asyncWrapper = require('../Middlewares/asyncWrapper');
const appError = require('../utils/appError.js');
const httpTextStatus = require('../utils/httpsStatusText.js');
const joi = require('joi');
const PassRegx =new RegExp(process.env.PASS_REGX);

const registerSchema = joi.object({
    email: joi.string().email().required(),
    password: joi.string().pattern(PassRegx).required().messages({
        message: 'Password must be Minimum eight characters, at least one letter and one number'
    }),
    passwordConfirm:joi.string().valid(joi.ref('password')).required().messages({
        message: 'Password confirmation does not match'
    })
}).unknown(true);

const register = asyncWrapper(
    async (req, res, next) => {
        const validation = registerSchema.validate(req.body)
        if(validation.error){
            return next(appError.create(validation.error.details[0].message,400,httpTextStatus.FAIL));
        }
        const files = req.files;
        //console.log(files);
        const data = req.body;
        const oldCustomer = await Customer.findOne({where:{email: data.email}});
        if(oldCustomer){
            const error = appError.create('User Already Exists' , 400 , httpTextStatus.FAIL);
            return next(error);
        }
        const token = jwt.sign({email: data.email  , phone: data.phone} , process.env.JWT_SECRET,{expiresIn:process.env.JWT_EXPIRE})
        const hashedPassword = await bcrypt.hash(data.password, 10);
        if(files){
            if(!files['nationalIdPhotoFace']  ||!files['nationalIdPhotoBack'] || !files['taxNumberPhoto'] ){
                return next(appError.create('There is Missed Photos ' , 500 , httpTextStatus.FAIL));
            }
            else {
            const customer = await Customer.create({
                ...data ,
                password: hashedPassword ,
                Token:token,
                nationalIdPhotoFace:files.nationalIdPhotoFace[0].filename,
                nationalIdPhotoBack:files.nationalIdPhotoBack[0].filename,
                taxNumberPhoto:files.taxNumberPhoto[0].filename});
                customer.save();
                return res.status(200).json({status:httpTextStatus.SUCCESS , data:{customer}});
            }
        }
        else return next(appError.create('There is Missed Photos ' , 500 , httpTextStatus.FAIL)); 
        
    }
);

const login =asyncWrapper(
    async (req, res, next) => {
        const {email, password} = req.body;
        const customer = await Customer.findOne({where:{email}});
        if(!customer){
            return next(appError.create('User Not Found', 401, httpTextStatus.FAIL));
        }
        const isMatch = await bcrypt.compare(password, customer.password);
        if(!isMatch){
            return next(appError.create('Invalid Email Or Password', 401, httpTextStatus.FAIL));
        }
        const token = jwt.sign({email: customer.email  , phone: customer.phone} , process.env.JWT_SECRET,{expiresIn:process.env.JWT_EXPIRE})
        customer.Token = token;
        await customer.save();
        res.status(200).json({status:httpTextStatus.SUCCESS, data:{customer:{
            id:customer.id,
            name: customer.name,
            email: customer.email,
            phone: customer.phone,
            Token: token,
            createdAt:customer.createdAt,
            updatedAt:customer.updatedAt,
        }}});
    }

);

module.exports = {
    register,
    login
};