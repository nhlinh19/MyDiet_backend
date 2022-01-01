const express = require('express');
const {getUser} = require('../middleware');

const postRouter = express.Router();
const postResolver = require('../resolvers/post');

postRouter.get('/uploadpost', postResolver.uploadPost);
postRouter.get('/commentpost', postResolver.commentPost)

module.exports = postRouter;