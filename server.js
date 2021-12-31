// .env config file
require('dotenv').config();

// Connect to MongoDB host
const DB_HOST = process.env.DB_HOST;
const db = require('./db');
db.connect(DB_HOST);

// Express app.
const express = require("express");
const app = express();

// Define all router.
const routers = require('./routers');
app.use('/user', routers.userRouter);

app.use('/', (req,res) => {
    res.send("MyDiet app");
});

const port = process.env.PORT || 8000;
app.listen(port, () => {
    console.log(`Listening on port ${port}!`)
});




