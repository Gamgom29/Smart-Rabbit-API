const express = require('express');
const db = require('./utils/database');
const dotenv = require('dotenv');
dotenv.config ({path:'config.env'});
const morgan = require('morgan');
const cors = require('cors');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 8000;
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true  }));
app.use(morgan('dev'));

app.get('/', (req, res) => {
    res.json({message:'API is running...'});
})
app.use('/api/uploads',express.static(path.join(__dirname , 'uploads')));
app.use('/api/customers',require('./Routes/customerRoutes'));

/* app.all('*' , (req, res,next)=>{

}) */

app.use((error,req,res,next)=>{
    res.status(error.code || 500).json({status:error.statusText , message:error.message});
})
db.sync().then(() => {
    // Start server
    app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    });
});