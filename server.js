const dotenv = require('dotenv');
dotenv.config ({path:'./config.env'});
const app = require('./app');
const mongoose = require('mongoose');
const companyService = require('./services/company.service');
const db = process.env.DATABASE.replace(
    "<password>",
    process.env.DB_PASS
);
mongoose
    .connect(db,).then(async()=>{
    await companyService.initialize();
    console.log("Company initialized");
    console.log("Database Is Connected ✅");
}).catch(err => {
    console.error("Failed to connect to database", err);
    process.exit(1); // Exit application with error code 1
})

app.listen(process.env.PORT, () => {
    console.log(`Server is running on http://localhost:${process.env.PORT}`);
    });