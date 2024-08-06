const express = require('express');
const router = express.Router();
const verifyToken = require('../Middlewares/verifyToken');
const adminController = require('../Controllers/admin.controller');
const authenticate = require('../Middlewares/authenticate');
const userRoles = require('../utils/userRoles');

router.post('/createAdmin' , adminController.createAdmin);
router.post('/login' , adminController.login);
router.get('/getAllOrders' , verifyToken , authenticate(userRoles.ADMIN),adminController.getAllOrders);
router.get('/getAllCustomers' , verifyToken , authenticate(userRoles.ADMIN),adminController.getAllCustomers);

module.exports = router;