const asyncWrapper = require("../Middlewares/asyncWrapper");
const Order = require('../Models/order.model.js');
const Customer = require('../Models/customer.model.js');
const appError = require("../utils/appError");
const stripe = require('stripe');
const httpsStatusText = require("../utils/httpsStatusText.js");
const stripeKey = process.env.STRIPE_KEY;
exports.checkoutSession = asyncWrapper(
    async (req, res, next) => {
        const order = await Order.find(req.params.orderId);
        if(!order){
            const error = appError.create('Order not found', 404, httpTextStatus.FAIL);
            return next(error);
        }
        console.log(req.params.orderId);
        const customer = await Customer.findById(order.userId);
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            SUCCESS_url:'http://localhost:8000/api/',
            cancel_url: 'http://localhost:8000/api/',
            line_items: [
            {
                name:customer.name,
                amount:order.orderPrice * 100,
                currency: 'usd',
                quantity: order.quantity,
            }
            ]
        })
        res.status(200).json({status: httpsStatusText.SUCCESS, data: { session} });
        // Generate checkout session with Stripe
    }
)