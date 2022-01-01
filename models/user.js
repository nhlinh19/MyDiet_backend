const mongoose = require('mongoose');

const userSchema = mongoose.Schema(
    {
        dietitianID:{
            type: mongoose.Schema.Types.ObjectID,
            ref: 'User'
        },
        username: {
            type: String,
            required: true,
            index: {
                unique: true
            }
        },
        password : {
            type: String,
            required: true
        },
        fullname : {
            type: String,
            required: true
        },
        email : {
            type: String,
            required: true,
            index: {
                unique: true
            }
        },
        phoneNumber : {
            type: String,
            required: true
        },
        about : {
            type: String
        },
        userType : {
            type: Number, //0: user, 1: dietitian, 2: admin
            required: true
        },
        avatar : {
            type: String //(path of the image save in cloud)
        },
        rating : {
            type: Number
        },
        needUpgrade : {
            type: Boolean //(If normal user want to upgrade to dietitian)
        }
    }
);

const User = mongoose.model('User', userSchema);
module.exports = User;