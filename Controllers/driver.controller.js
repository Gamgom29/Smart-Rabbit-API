const Driver = require('../Models/driver.model.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const asyncWrapper = require('../Middlewares/asyncWrapper');
const appError = require('../utils/appError.js');
const httpTextStatus = require('../utils/httpsStatusText.js');
const PassRegx =new RegExp(process.env.PASS_REGX);
const Email = require('../utils/Email.js');
const generateToken = require('../utils/generateToken.js');
const Address = require('../Models/address.model.js');


const register = asyncWrapper(
    async(req,res,next) => {
        const files = req.files;
        const data = req.body;
        const oldDriver = await Driver.findOne({phone: data.phone});
        if(oldDriver)
            return next(appError.create('User Already Exists' , 400 , httpTextStatus.FAIL));
        
        if(!PassRegx.test(data.password))
            return next(appError.create('Password must be Minimum eight characters, at least one letter and one number' , 400 , httpTextStatus.FAIL));
        
        else if(data.password != data.passwordConfirm)
            return next(appError.create('Password confirmation does not match' , 400 , httpTextStatus.FAIL));
        
        const hashedPassword = await bcrypt.hash(data.password, 10);
        if(files){
            if(!files['nationalIdPhotoFace']  ||!files['nationalIdPhotoBack'] || !files['license'] ){
                return next(appError.create('There is Missed Photos ' , 500 , httpTextStatus.FAIL));
            }
            else {
                const driver = await new Driver({
                    ...data,
                    password: hashedPassword,
                    nationalIdPhotoFace:files.nationalIdPhotoFace[0].filename,
                    nationalIdPhotoBack:files.nationalIdPhotoBack[0].filename,
                    license:files.license[0].filename
                });
                const token = generateToken({email: data.email  , phone: data.phone , id : driver._id});
                driver.token = token;
                await driver.save();
                const email = new Email(driver,'');
                await email.sendWelcome();
                return res.status(200).json({status:httpTextStatus.SUCCESS , data:{driver}});
            }
        }
        else return next(appError.create('There is Missed Photos ' , 500 , httpTextStatus.FAIL)); 
    }
);
module.exports ={
    register
}