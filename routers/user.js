const express = require("express");
const getUser = require('../middleware');
const userRouter = express.Router();
const userResolver = require('../resolvers/user');

userRouter.get('/', getUser, userResolver.me);
userRouter.post('/signup', userResolver.signUp);
userRouter.post('/signin', userResolver.signIn);
userRouter.post('/update', getUser, userResolver.updateUser);
userRouter.post('/change_password', getUser, userResolver.changePassword);
userRouter.post('/update_request', getUser, userResolver.requestTobeDietitian);
userRouter.get('/personal_dietitian', getUser, userResolver.myPersonalDietitian);
userRouter.post('/upload_avatar', getUser, userResolver.uploadAvatar);

module.exports = userRouter;    