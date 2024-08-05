const express = require('express');
const router = express.Router();
const paymentController = require('../Controllers/payment.controller.js');
const verifyToekn = require('../Middlewares/verifyToken.js');
const checkOrderStatus = require('../Middlewares/checkOrderStatus.js')

router.post('/checkout-session/:orderId' ,checkOrderStatus, verifyToekn ,paymentController.checkoutSession );
router.get('/payment-success' , paymentController.paymentSuccesss);
router.get('/payment-cancelled' , paymentController.paymentCancelled)
module.exports = router; 
