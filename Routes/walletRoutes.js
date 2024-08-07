const express = require('express');
const router = express.Router();
const walletController = require('../Controllers/wallet.Controller');
const verifyToken = require('../Middlewares/verifyToken');
const checkOrderStatus = require('../Middlewares/checkOrderStatus')
router.get('/customer-wallet/:id' , verifyToken, walletController.getWallet);
router.post('/pay-with-wallet/:id' ,checkOrderStatus, verifyToken, walletController.payWithWallet);
router.post('/withdraw' , verifyToken , walletController.withDraw);
module.exports = router;