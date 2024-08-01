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
            success_url:'https://smart-rabbit-api.onrender.com/paymetnSuccess',
            cancel_url: 'https://smart-rabbit-api.onrender.com/',
            line_items: [
            {
                price_data: {
                    currency: 'EGP',
                    unit_amount: order.orderPrice * 10,
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

const webhook = asyncWrapper(async(req,res,next)=>{
    const signature = req.headers['stripe-signature'];
    let event;
    try {
        event = stripe.webhooks.constructEvent(req.body, signature, process.env.WEBHOOK_SECRET);
        if(event.type=='checkout.session.completed'){
            const session = event.data.object;
            // Find the order by session ID or some other identifier you stored during session creation
            const orderId = session.client_reference_id; // Assuming you set this when creating the session
            const order = await Order.findById(orderId);
            if (order) {
                order.paymentStatus = 'Paid';
                await order.save();
            }
        }
    } catch (err) {
        console.error('Error with webhook: ', err.message);
        return res.status(400).send(`Error with webhook: ${err.message}`);
    }
    res.json({ received: true });
})
module.exports = {
    checkoutSession,
    webhook
}