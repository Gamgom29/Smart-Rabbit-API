const express = require('express');
const router = express.Router();
const paymentController = require('../Controllers/payment.controller.js');
const appError = require('../utils/appError.js');
const verifyToekn = require('../Middlewares/verifyToken.js');
const paymentStatus = require('../Middlewares/checkOrderStatus.js')

router.post('/checkout-session/:orderId' ,paymentStatus, verifyToekn ,paymentController.checkoutSession )
module.exports = router;