const Customer = require('../Models/customer.model.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const asyncWrapper = require('../Middlewares/asyncWrapper');
const appError = require('../utils/appError.js');
const httpTextStatus = require('../utils/httpsStatusText.js');
const PassRegx =new RegExp(process.env.PASS_REGX);
const Email = require('../utils/Email.js')
const register = asyncWrapper(
    async (req, res, next) => {
        const files = req.files;
        //console.log(files);
        const data = req.body;
        const oldCustomer = await Customer.findOne({phone: data.phone});
        if(oldCustomer){
            const error = appError.create('User Already Exists' , 400 , httpTextStatus.FAIL);
            return next(error);
        }
        if(!PassRegx.test(data.password)){
            return next(appError.create('Password must be Minimum eight characters, at least one letter and one number' , 400 , httpTextStatus.FAIL));
        }else if(data.password != data.passwordConfirm){
            return next(appError.create('Password confirmation does not match' , 400 , httpTextStatus.FAIL));
        }
        const token = jwt.sign({email: data.email  , phone: data.phone} , process.env.JWT_SECRET,{expiresIn:process.env.JWT_EXPIRE})
        const hashedPassword = await bcrypt.hash(data.password, 10);
        if(files){
            if(!files['nationalIdPhotoFace']  ||!files['nationalIdPhotoBack'] || !files['taxNumberPhoto'] ){
                return next(appError.create('There is Missed Photos ' , 500 , httpTextStatus.FAIL));
            }
            else {
                const customer = await new Customer({
                    ...data,
                    password: hashedPassword,
                    token,
                    nationalIdPhotoFace:files.nationalIdPhotoFace[0].filename,
                    nationalIdPhotoBack:files.nationalIdPhotoBack[0].filename,
                    taxNumberPhoto:files.taxNumberPhoto[0].filename
                });
                await customer.save();
                const email = new Email(customer,'');
                await email.sendWelcome();
                return res.status(200).json({status:httpTextStatus.SUCCESS , data:{customer}});
            }
        }
        else return next(appError.create('There is Missed Photos ' , 500 , httpTextStatus.FAIL)); 
        
    }
);

const login =asyncWrapper(
    async (req, res, next) => {
        const {phone, password} = req.body;
        const customer = await Customer.findOne({phone:phone});
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
            _id:customer._id,
            name: customer.name,
            email: customer.email,
            phone: customer.phone,
            Token: token,
            createdAt:customer.createdAt,
            updatedAt:customer.updatedAt,
        }}});
    }

);

const forgetpassword = asyncWrapper(
    async (req, res, next) => {
        const customerEmail = req.body.email;
        //console.log(customerEmail);
        const customer = await Customer.findOne({email:customerEmail});
        if(!customer){
            return next(appError.create('User Not Found', 404, httpTextStatus.FAIL));
        }
        // generate code
        const OTP =  customer.generateOTP();
        await customer.save({validateBeforeSave:false});
        const email = new Email(customer , OTP);
        const otpToken = jwt.sign({email: customer.email  , phone: customer.phone} , process.env.JWT_SECRET,{expiresIn:"10m"});
        //console.log(OTP);
        email.sendResetPassword(OTP);
        // send email with new password
        //...
        res.status(200).json({status:httpTextStatus.SUCCESS, message: 'Reset Code has been sent to your email.' , otpToken});
    }
);
const checkOTP = asyncWrapper(
    async(req,res,next)=>{
        const token = req.headers['otp'].split(' ')[1];
        const decodeToken = jwt.decode(token , process.env.JWT_SECRET);
        console.log(decodeToken.email);
        const customer = await Customer.findOne({
            email:decodeToken.email,
            OTP: req.body.OTP,
            OTPExp:{$gte :Date.now()},
        });
        if(!customer){
            return next(appError.create('Invalid OTP or Expired', 401, httpTextStatus.FAIL));
        }
        customer.OTP = undefined; 
        customer.OTPExp = undefined;
        const resetToken = jwt.sign({email:customer.email , phone:customer.phone} ,process.env.JWT_SECRET , {expiresIn:'10m'} );
        await customer.save({validateBeforeSave:false});
        res.status(200).json({status:httpTextStatus.SUCCESS , message : 'Valid OTP Code Go To Change Password' , resetToken} );
    }
)
const resetPassword = asyncWrapper(
    async(req , res , next)=>{
        const token = req.headers['resetpassword'].split(' ')[1];
        const decodeToken = jwt.decode(token , process.env.JWT_SECRET);
        const customer = await Customer.findOne({
            email:decodeToken.email
        });
        if(!customer){
            return next(appError.create('User Not Found', 404, httpTextStatus.FAIL));
        }
        const {password,passwordConfirm} = req.body;
        if(password!==passwordConfirm){
            return next(appError.create('Password confirmation does not match', 400, httpTextStatus.FAIL));
        }else if(!PassRegx.test(password)){
            return next(appError.create('Password must be Minimum eight characters, at least one letter and one number', 400, httpTextStatus.FAIL));
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        Customer.updateOne({email:decodeToken.email} , {$set:{password:hashedPassword}});
        res.status(200).json({status:httpTextStatus.SUCCESS, message : 'Password Changed Successfully'});
    }
)

module.exports = {
    register,
    login,
    forgetpassword,
    checkOTP,
    resetPassword
};