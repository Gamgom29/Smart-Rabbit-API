const appError = require("../utils/appError");

module.exports =(...roles)=>{

    return (req,res,next)=>{
        const role = req.currentUser.role;
        if(!roles.includes(role)){
            return next(appError.create('Unauthorized', 401, 'Unauthorized'));
        }
        next();
    }
}