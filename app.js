const express = require('express');
const dotenv = require('dotenv');
const Order =require('./Models/order.model')
dotenv.config ({path:'config.env'});
const errorHandler = require('./Middlewares/errorHandler')
const morgan = require('morgan');
const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser');
const httpsStatusText = require('./utils/httpsStatusText');
const app = express();
const stripeKey = process.env.STRIPE_KEY;
const stripe = require('stripe')(stripeKey);
const endpointSecret = process.env.WEBHOOK_SECRET;;
app.use(cors());
app.use(express.urlencoded({ extended: true  }));
app.use(morgan('dev'));
app.post('/webhook', bodyParser.raw({ type: 'application/json' }), async (req, res) => {
    const sig = req.headers['stripe-signature'];

    let event = req.body;

    try {
        event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } catch (err) {
        console.log(`⚠️  Webhook signature verification failed.`, err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    switch (event.type) {
        case 'checkout.session.completed':
            const session = event.data.object;
            // Find the order by session ID or some other identifier you stored during session creation
            const orderId = session.client_reference_id; // Assuming you set this when creating the session
            const order = await Order.findById(orderId);
            if (order) {
                order.paymentStatus = 'Paid';
                await order.save();
            }
            break;
        // ... handle other event types
        default:
            console.log(`Unhandled event type ${event.type}`);
    }

    // Return a response to acknowledge receipt of the event
    res.json({ received: true });
});
app.use(express.json());
app.get('/', (req, res) => {
    res.json({message:'API is running...'});
})
app.get('/paymetnSuccess' , (req, res) => {
    res.json({message:'Payment Successful'});
})
app.use('/api/uploads',express.static(path.join(__dirname , 'uploads')));
app.use('/api/customers',require('./Routes/customerRoutes'));
app.use('/api/orders' , require('./Routes/orderRoutes'));
app.use('/api/payment' , require('./Routes/paymentRoutes'));

app.use(errorHandler);
app.all('*' , (req, res,next)=>{
    res.json({status:httpsStatusText.ERROR , message:'this resource is not available.'});
})


module.exports = app;