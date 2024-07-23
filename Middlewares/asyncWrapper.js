const { ValidationError } = require("sequelize");

module.exports = (asyncFn)=>{
    return (req,res,next)=>{
        asyncFn(req,res,next).catch(err=>{
            next(err);
        })
}
}