const dotenv = require('dotenv');
dotenv.config ({path:'./config.env'});
const app = require('./app');
const mongoose = require('mongoose');
const db = process.env.DATABASE.replace(
    "<password>",
    process.env.DB_PASS
);
mongoose
    .connect(db).then(()=>{
    console.log("Database Is Connected ✅");
})

app.listen(process.env.PORT, () => {
    console.log(`Server is running on http://localhost:${process.env.PORT}`);
    });