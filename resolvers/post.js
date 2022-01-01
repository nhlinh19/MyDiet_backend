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

            return res.json(post);
        }
        catch (error){
            return res.json({
                status: 0,
                message: "Unexpected error."
            })
        }
    }
}