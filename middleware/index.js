const jwt = require('jsonwebtoken');
require('dotenv').config();

// A middleware to find the user's token from a request.
const getUser = (req, res, next) => {
    const token = req.headers.authorization;
    if (token) {
        try {
            req.user = jwt.verify(token, process.env.JWT_SECRET || "secret_key");
            next();
        }
        catch (error) {
            return res.json({
                status: 404,
                message: 'No token'
            });
        }
    }
    else {
        return res.json({
            status: 404,
            message: 'No token'
        });
    }
}

module.exports = getUser;