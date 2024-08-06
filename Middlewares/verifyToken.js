const jwt = require('jsonwebtoken');

const verifyToken = (req,res,next)=>{
    const authHeader = req.headers['Authorization'] || req.headers['authorization']
    if(!authHeader){
        return res.status(401).json({status:401, message:'Token is required!! .'});
    }
    const token = authHeader.split(' ')[1];
    try{
        const currentUser = jwt.verify(token , process.env.JWT_SECRET);
        req.currentUser = currentUser;
        next();
    }catch(err){
        return res.status(401).json({status:401, message:'Token is not valid.'});
    }
    //next();
}
module.exports = verifyToken;