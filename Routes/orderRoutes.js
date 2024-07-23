const express = require('express');
const router = express.Router();
const orderController = require('../Controllers/order.controller.js');
const appError = require('../utils/appError.js');
const verifyToekn = require('../Middlewares/verifyToken.js');

router.post('/placeorder' , verifyToekn , orderController.CreateOrder);

router.route('/:id')
            .get(verifyToekn , orderController.getOrder);

module.exports = router;