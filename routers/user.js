const express = require("express");
const {getUser} = require('../middleware');
const userRouter = express.Router();
const userResolver = require('../resolvers/user');

userRouter.get('/', getUser, userResolver.me);
userRouter.post('/signup', userResolver.signUp);
userRouter.post('/signin', userResolver.signIn);

module.exports = userRouter;    