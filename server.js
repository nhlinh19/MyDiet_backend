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

// Security and CORS
const helmet = require('helmet');
const cors = require('cors');
app.use(helmet());
app.use(cors());

app.get('/', (req, res) => {
    req.body = {
        username: "nltuong", 
        fullname: "Nguyen Lam Tuong", 
        email: "nltuong@gmail.com", 
        password: "1234568", 
        phoneNumber: "93429384983"
    };
    console.log(req.body);
    res.send("myDiet");
})

// Define all router.
const routers = require('./routers');
app.use('/user', routers.userRouter);
app.use('/food', routers.foodRouter);
app.use('/post', routers.postRouter);

const port = process.env.PORT || 8000;
app.listen(port, () => {
    console.log(`Listening on port ${port}!`)
});






