const express = require('express');
const {getUser} = require('../middleware');

const postRouter = express.Router();
const postResolver = require('../resolvers/post');

postRouter.get('/uploadpost', postResolver.uploadPost)

module.exports = postRouter;