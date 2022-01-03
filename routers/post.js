const express = require("express");
const getUser = require("../middleware");

const postRouter = express.Router();
const postResolver = require("../resolvers/post");

/* req.body.postType,
req.body.content,
req.body.image*/
postRouter.post("/uploadpost", getUser, postResolver.uploadPost);

// req.body.postID, req.body.content
postRouter.post("/commentpost", getUser, postResolver.commentPost);

/* req.query -> _id cua post cuoi cung hien thi trong feed
req.body.type*/
postRouter.post("/getpostlist", getUser, postResolver.getPostList);

// req.body.postID
postRouter.post("/togglelike", getUser, postResolver.toggleLike);

// req.body.postID
postRouter.post("/getcomment", postResolver.getComment);

module.exports = postRouter;
