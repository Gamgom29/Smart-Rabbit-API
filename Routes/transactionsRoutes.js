const express =require('express');
const verifyToken = require('../Middlewares/verifyToken');
const setCustomerId = require('../Middlewares/setCustomerId');
const transactionController = require('../Controllers/transaction.controller');
const router = express.Router();

router.get('/getTransaction/:id' , verifyToken , setCustomerId , transactionController.getTransaction);
router.get('/getAllUserTrransactions' , verifyToken , setCustomerId , transactionController.getUserTransactions);

module.exports = router;