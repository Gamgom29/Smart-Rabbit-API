const asyncWrapper = require("../Middlewares/asyncWrapper.js");
const Order = require('../Models/order.model.js');
const Customer = require('../Models/customer.model.js');
const appError = require("../utils/appError");
const stripeKey = process.env.STRIPE_KEY;
const stripe = require('stripe')(stripeKey);
const httpsStatusText = require("../utils/httpsStatusText.js");

const checkoutSession = asyncWrapper(
    async (req, res, next) => {
        const order = await Order.findById(req.params.orderId);
        if(!order){
            const error = appError.create('Order not found', 404, httpTextStatus.FAIL);
            return next(error);
        }
        console.log(req.params.orderId);
        const customer = await Customer.findById(order.userId);
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            success_url:'http://localhost:8000/paymetnSuccess',
            cancel_url: 'http://localhost:8000/',
            line_items: [
            {
                price_data: {
                    currency: 'EGP',
                    unit_amount: order.orderPrice * 100,
                    product_data: {
                        name: customer.name,
                        description:order.receiverAddress
                    },
                    },
                    quantity: order.quantity,
                }],
            mode:'payment',
            client_reference_id:order._id.toString()
        })
        res.status(200).json({status: httpsStatusText.SUCCESS, data: { session} });
        // Generate checkout session with Stripe
    }
);
module.exports = {
    checkoutSession
}