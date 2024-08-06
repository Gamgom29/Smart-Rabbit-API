const jwt = require('jsonwebtoken');
module.exports = (payload)=>{
    const token = jwt.sign(payload,process.env.JWT_SECRET,{expiresIn:process.env.JWT_EXPIRE});
    return token;
}