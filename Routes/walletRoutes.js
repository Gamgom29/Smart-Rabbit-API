const express = require('express');
const router = express.Router();
const walletController = require('../Controllers/wallet.Controller');
const verifyToken = require('../Middlewares/verifyToken');

router.get('/customer-wallet' , verifyToken, walletController.getWallet);

module.exports = router;