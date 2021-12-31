const mongoose = require('mongoose');

const likeSchema = mongoose.Schema(
    {
        //id???
        userID: {
            type: mongoose.Schema.Types.ObjectID,
            ref: 'User',
            required: true
        },
        postID: {
            type: mongoose.Schema.Types.ObjectID,
            ref: 'Post',
            required: true
        }
    }
);

const Like = mongoose.model('Like', likeSchema);
module.exports = Like;