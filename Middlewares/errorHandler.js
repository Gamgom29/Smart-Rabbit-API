const httpStatusText = require('../utils/httpsStatusText')
const mongoose = require('mongoose');
module.exports= (err, req,res,next)=>{
    if (err instanceof mongoose.Error.ValidationError) {
        return res.status(err.code||400).json({
            status:httpStatusText.FAIL,
            message: err.message|| 'Validation Error',
            errors: Object.keys(err.errors).map(key => err.errors[key].message)
        });
    }
    if (err instanceof mongoose.Error.CastError) {
        return res.status(err.code||400).json({
            status: httpStatusText.FAIL,
            message: 'Invalid ID Format'
        });
    }

    if (err.code === 11000) { // Duplicate key error
        return res.status(409).json({
            status: httpStatusText.ERROR,
            message: 'Duplicate Key Error',
            details: err.keyValue
        });
    }

    res.status(500).json({
        status: httpStatusText.FAIL,
        message:err.message || 'Internal Server Error',
    });
}