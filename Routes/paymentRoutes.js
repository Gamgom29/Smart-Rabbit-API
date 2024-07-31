const express = require('express');
const router = express.Router();
const paymentController = require('../Controllers/payment.controller.js');
const appError = require('../utils/appError.js');
const verifyToekn = require('../Middlewares/verifyToken.js');


router.get('/checkout-session/:orderId' , verifyToekn ,paymentController.checkoutSession )
module.exports = router;