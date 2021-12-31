const mongoose = require('mongoose');

const commentSchema = mongoose.Schema(
    {
        //id????
        userID: {
            type: mongoose.Schema.Types.ObjectID,
            ref: 'User',
            required: true
        },
        postID: {
            type: mongoose.Schema.Types.ObjectID,
            ref: 'Post',
            required: true
        },
        dateTime: { 
            type: Date,
            required: true,
        },
        content : {
            type: String
        }
    }
);

const Comment = mongoose.model('Comment', commentSchema);
module.exports = Comment;