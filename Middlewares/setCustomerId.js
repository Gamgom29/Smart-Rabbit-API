const jwt = require('jsonwebtoken');

const setCustomerId =  (req , res , next)=>{
        let token = req.headers['Authorization'] || req.headers['authorization'];
        token = token.split(' ')[1];
        const decodeToken = jwt.decode(token , process.env.JWT_SECRET);
        let id = decodeToken.id;
        req.currentUser = id;
        next();
}
module.exports = setCustomerId