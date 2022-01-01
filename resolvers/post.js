const model = require('../models')
const mongoose = require('mongoose')

module.exports = {
    uploadPost: async (req, res) =>{
        let {
            //ownerID,
            postType,
            dateTime,
            content,
            image
        } = req.body;

        if (/*!ownerID ||*/ !postType || !dateTime || (!content & !image)){
            return res.json({
                status: 0,
                message: "Not enough information."
            });
        }

        try {
            user = await model.User.findOne();
            const post = new model.Post({
                ownerID : /*ownerID*/ user.id,
                postType : postType,
                dateTime : dateTime,
                content : content,
                image : image
            });

            await post.save()
            .then(doc => {
                console.log(doc)
            })
            .catch(err => {
                console.error(err)
            });

            return res.json({
                status : 1,
                message: "Post successfully.",
                data: post
            });
        }
        catch (error){
            return res.json({
                status: 0,
                message: "Unexpected error."
            })
        }
    },
    commentPost: async (req, res) =>{
        let {
            /*userID,
            postID,*/
            dateTime,
            content
        } = req.body;

        if (/*!userID || !postID || */!dateTime || !content){
            return res.json({
                status: 0,
                message: "Not enough information."
            });
        }

        try {
            user = await model.User.findOne();
            post = await model.Post.findOne();
            const comment = new model.Comment({
                userID : user.id,
                postID : post.id,
                dateTime : dateTime,
                content : content,
            });

            await comment.save()
            .then(doc => {
                console.log(doc)
            })
            .catch(err => {
                console.error(err)
            });

            return res.json({
                status: 1,
                message: "Comment successfully.",
                data : comment
            });
        }
        catch (error){
            return res.json({
                status: 0,
                message: "Unexpected error."
            })
        }
    }
}