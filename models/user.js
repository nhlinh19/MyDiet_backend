const mongoose = require('mongoose');

const userSchema = mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            index: {
                unique: true
            }
        },
        email: {
            type: String,
            required: true,
            index: {
                unique: true
            }
        },
        password: {
            type: String,
            required: true
        },
        avatar: {
            type: String
        },
        body: {
            type: String
        } 
    },
    {
        timestamp: true
    }
);

const User = mongoose.model('User', userSchema);
module.exports = User;