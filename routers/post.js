const express = require('express');
const getUser = require('../middleware');

const postRouter = express.Router();
const postResolver = require('../resolvers/post');

postRouter.get('/uploadpost',getUser, postResolver.uploadPost);
postRouter.get('/commentpost',getUser, postResolver.commentPost);
postRouter.use('/getpostlist', getUser, postResolver.getPostList);
postRouter.get('/togglelike', getUser, postResolver.toggleLike);

module.exports = postRouter;