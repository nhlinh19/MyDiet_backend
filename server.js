// .env config file
require('dotenv').config();

// Connect to MongoDB host
const DB_HOST = process.env.DB_HOST;
const db = require('./db');
db.connect(DB_HOST);

// Express app.
const express = require("express");
const app = express();

// Help parse request's json body into req.body.
// Note: Header's content-type must be 'application/json'
app.use(express.json());

// Define all router.
const routers = require('./routers');
app.use('/user', routers.userRouter);
app.use('/food', routers.foodRouter);

app.use('/', (req,res) => {
    res.send("MyDiet app");
});

const port = process.env.PORT || 8000;
app.listen(port, () => {
    console.log(`Listening on port ${port}!`)
});




