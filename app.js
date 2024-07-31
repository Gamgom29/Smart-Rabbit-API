const express = require('express');
const dotenv = require('dotenv');
dotenv.config ({path:'config.env'});
const errorHandler = require('./Middlewares/errorHandler')
const morgan = require('morgan');
const cors = require('cors');
const path = require('path');
const httpsStatusText = require('./utils/httpsStatusText');
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true  }));
app.use(morgan('dev'));

app.get('/', (req, res) => {
    res.json({message:'API is running...'});
})
app.use('/api/uploads',express.static(path.join(__dirname , 'uploads')));
app.use('/api/customers',require('./Routes/customerRoutes'));
app.use('/api/orders' , require('./Routes/orderRoutes'));
app.use('api/payment' , require('./Routes/paymentRoutes'));
app.use(errorHandler);
app.all('*' , (req, res,next)=>{
    res.json({status:httpsStatusText.ERROR , message:'this resource is not available.'});
})


module.exports = app;