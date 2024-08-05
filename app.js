const express = require('express');
const dotenv = require('dotenv');
const errorHandler = require('./Middlewares/errorHandler')
const paymentControoler = require('./Controllers/payment.controller');
const morgan = require('morgan');
const cors = require('cors');
const path = require('path');
const httpsStatusText = require('./utils/httpsStatusText');
dotenv.config ({path:'config.env'});

const app = express();
app.post('/webhook', express.raw({ type: 'application/json' }) , paymentControoler.webhook);

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true  }));

app.get('/', (req, res) => {
    res.json({message:'API is running...'});
})
app.use('/api/uploads',express.static(path.join(__dirname , 'uploads')));
app.use('/api/customers',require('./Routes/customerRoutes'));
app.use('/api/orders' , require('./Routes/orderRoutes'));
app.use('/api/payment' , require('./Routes/paymentRoutes'));
app.use('/api/wallets' , require('./Routes/walletRoutes'));
app.use(errorHandler);
app.all('*' , (req, res,next)=>{
    res.json({status:httpsStatusText.ERROR , message:'this resource is not available.'});
})


module.exports = app;