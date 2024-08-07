const express = require('express');
const router = express.Router();
const customerController = require('../Controllers/customerController.js');
const multer  = require('multer');
const appError = require('../utils/appError.js');
const verifyToken = require('../Middlewares/verifyToken.js');
const diskStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname)
    }
});
const fileFilter = (req,file,cb)=>{
    const imageType = file.mimetype.split('/')[0];
    if(imageType ==='image'){
        return cb(null, true);
    }else return cb(appError.create('unSupported File Type' , 500 ,'fail'), false);
}
const upload = multer({ storage: diskStorage /* ,fileFilter:fileFilter  */})

router.route('/signup')
    .post(upload.fields([{name:'nationalIdPhotoFace'} , {name:'nationalIdPhotoBack'},{name:'taxNumberPhoto'}])
    ,customerController.register);

router.post('/login' , customerController.login);
router.post('/forgetpassword' , customerController.forgetPassword)
router.post('/CheckOTP', customerController.checkOTP);
router.patch('/resetpassword', customerController.resetPassword);
router.route('/:id')
            .get(verifyToken , customerController.getProfile)
            .delete(verifyToken , customerController.deleteCustomer);
router.post('/addAddress' , verifyToken , customerController.addAddress);
module.exports = router;