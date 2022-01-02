const model = require('../models')
const mongoose = require('mongoose')
const multiparty = require('multiparty');

module.exports = {
    uploadPost: async (req, res) =>{
        try{
            const user = await model.User.findById(req.user.id);
            if (!user) {
                return res.json({
                    status: 0,
                    message: 'Not valid user.'
                });
            }

            /*const form = new multiparty.Form();
            form.parse(req, async (error, fields, files) => {
                if (error) {
                    return res.json({
                        status: 0,
                        message: 'Cannot parse information.'
                    });
                }

                let {
                    postType,
                    content
                } = fields;
                let {
                    image
                } = files;
    
                if (!postType || (!content && !image)){
                    return res.json({
                        status: 0,
                        message: "Not enough information."
                    });
                }
                
                const post = new model.Post({
                    ownerID : mongoose.Types.ObjectId(user._id),
                    postType : postType,
                    dateTime : new Date(),
                    content : content
                });

                await post.save()
                .then(doc => {
                    console.log(doc)
                })
                .catch(err => {
                    console.error(err)
                });

                //Post image

                return res.json({
                    status : 1,
                    message: "Post successfully.",
                    data: post
                });
            })*/

            let {
                postType,
                content,
                image
            } = req.body;
    
            if (!postType || (!content && !image)){
                return res.json({
                    status: 0,
                    message: "Not enough information."
                });
            }
            const post = new model.Post({
                ownerID : mongoose.Types.ObjectId(user._id),
                postType : postType,
                dateTime : new Date(),
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
        try{
            const user = await model.User.findById(req.user.id);
            if (!user) {
                return res.json({
                    status: 0,
                    message: 'Not valid user.'
                });
            }
            let {
                //postID,
                content
            } = req.body;

            if (!content){
                return res.json({
                    status: 0,
                    message: "Content must not be empty."
                });
            }

            post = await model.Post.findOne();
            const comment = new model.Comment({
                userID : mongoose.Types.ObjectId(user._id),
                postID : post.id,
                dateTime : Date(),
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