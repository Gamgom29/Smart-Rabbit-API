const express = require('express');
const router = express.Router();
const orderController = require('../Controllers/order.controller.js');
const appError = require('../utils/appError.js');
const verifyToekn = require('../Middlewares/verifyToken.js');

router.post('/createorder' , verifyToekn , orderController.CreateOrder);


router.route('/:id' )
            .get(verifyToekn,orderController.getOrder)
            .delete(verifyToekn , orderController.deleteOrder)
router.get('/userorders/:id',verifyToekn , orderController.getAllOrders);

module.exports = router;