const express = require('express');
const router = express.Router();
const paymentController = require('../Controllers/payment.controller.js');
const verifyToken = require('../Middlewares/verifyToken.js');
const checkOrderStatus = require('../Middlewares/checkOrderStatus.js')

router.post('/checkout-session/:orderId' ,checkOrderStatus, verifyToken ,paymentController.checkoutSession );
router.get('/payment-success' , paymentController.paymentSuccess);
router.get('/payment-cancelled' , paymentController.paymentCancelled)
module.exports = router; 
