const express = require('express');
const getUser = require('../middleware');

const postRouter = express.Router();
const postResolver = require('../resolvers/post');

postRouter.get('/uploadpost',getUser, postResolver.uploadPost);
postRouter.get('/commentpost',getUser, postResolver.commentPost);
postRouter.use('/getpostlist', getUser, postResolver.getPostList);

module.exports = postRouter;