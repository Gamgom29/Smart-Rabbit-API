const jwt = require('jsonwebtoken');

const verifyToekn = (req,res,next)=>{
    const authHeader = req.headers['Authorization'] || req.headers['authorization']
    if(!authHeader){
        return res.status(401).json({status:401, message:'Token is required!! .'});
    }
    const token = authHeader.split(' ')[1];
    try{
        const decodeToken = jwt.verify(token , process.env.JWT_SECRET);
        next();
    }catch(err){
        return res.status(401).json({status:401, message:'Token is not valid.'});
    }
    //next();
}
module.exports = verifyToekn;