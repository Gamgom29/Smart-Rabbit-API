const express = require('express');
const router = express.Router();
const orderController = require('../Controllers/order.controller.js');
const appError = require('../utils/appError.js');
const verifyToekn = require('../Middlewares/verifyToken.js');
const  checkOrderStatus = require('../Middlewares/checkOrderStatus.js')
router.post('/createorder' , verifyToekn , orderController.CreateOrder);
router.route('/:id' )
            .get(verifyToekn,orderController.getOrder)
            .delete(verifyToekn , orderController.deleteOrder)
router.get('/user-orders/:id',verifyToekn , orderController.getAllOrders);

router.patch('/order-status/:id' , checkOrderStatus,verifyToekn , orderController.changeOrderState);

module.exports = router;