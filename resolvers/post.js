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
    
            if (postType == null || (!content && !image)){
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
                postID,
                content
            } = req.body;

            if (!content || !postID){
                return res.json({
                    status: 0,
                    message: "Not enough information."
                });
            }

            const comment = new model.Comment({
                userID : mongoose.Types.ObjectId(user._id),
                postID : postID,
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
    },
    getPostList : async (req, res) =>{
        try{
            const user = await model.User.findById(req.user.id);
            if (!user) {
                return res.json({
                    status: 0,
                    message: 'Not valid user.'
                });
            }

            let {
                type
            } = req.body;

            if (type == null){
                return res.json({
                    status: 0,
                    message: "Type must not be empty."
                });
            }

            // Set limit 20 posts per request
            const limit = 20;
            const {cursor} = req.query;

            let cursorQuery = {};

            if (cursor) {
                cursorQuery = {
                    _id: {
                        $lt: cursor
                    }
                };
            }
            
            const posts = await model.Post.find({cursorQuery, postType : type})
                        .sort({id: -1})
                        .limit(limit);
 
            const postFeed = await Promise.all(
                posts.map(async post => {
                    const owner = await model.User.findById(post.ownerID);
                    return {
                        _id: post._id,
                        ownerID: {
                            _id: post.ownerID,
                            name: owner.fullname,
                        },
                        dateTime: post.dateTime,
                        content: post.content,
                        image: post.image
                    }
                })
            )

            let newCursor = '';
            if (posts.length > 0) {
                newCursor = posts[posts.length - 1]._id;
            }

            return res.json({
                status: 1,
                message: 'Successful post feed retrieval.',
                data: {
                    postFeed,
                    cursor: newCursor
                }
            });
        }
        catch (error){
            return res.json({
                status: 0,
                message: "Unexpected error."
            })
        }
    },
    toggleLike : async (req, res) =>{
        try{
            const user = await model.User.findById(req.user.id);
            if (!user) {
                return res.json({
                    status: 0,
                    message: 'Not valid user.'
                });
            }

            let {
                postID
            } = req.body;

            if (!postID){
                return res.json({
                    status: 0,
                    message: "Not enough information."
                });
            }

            const isLiked = await model.Like.find({userID: user._id, postID : postID}).count();
            
            if (isLiked <= 0){
                const like = new model.Like({
                    userID : mongoose.Types.ObjectId(user._id),
                    postID : postID
                });
    
                await like.save()
                .then(doc => {
                    console.log(doc)
                })
                .catch(err => {
                    console.error(err)
                });
            }
            else {
                await model.Like.deleteOne({userID : user._id, postID : postID});
            }
            return res.json({
                status: 1,
                message : "Toggle successfully"
            });
        }
        catch (error){
            return res.json({
                status: 0,
                message: "Unexpected error."
            })
        }
    },
}