const Order = require('../Models/order.model');

const CheckPaymentStatus =async  (req , res , next) => {
    const orderId = req.params.orderId;
    const order = await Order.findById(orderId);
    if(order.paymentStatus == 'Paid'){
        return res.status(401).json({status: "fail" , message :"This Order is Already Paid"});
    }
    next();
}
module.exports = CheckPaymentStatus;