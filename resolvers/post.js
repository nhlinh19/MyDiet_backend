const model = require("../models");
const mongoose = require("mongoose");
const multiparty = require("multiparty");
const fs = require("fs");
const { uploadImage } = require("../utils");

module.exports = {
  uploadPost: async (req, res) => {
    try {
      const user = await model.User.findById(req.user.id);
      if (!user) {
        return res.json({
          status: 0,
          message: "Not valid user.",
        });
      }
      const form = new multiparty.Form();
      form.parse(req, async (error, fields, files) => {
        if (error) {
          return res.json({
            status: 0,
            message: "Cannot parse image.",
          });
        }

        const postType = fields.postType[0] === "true";
        const content = fields.content[0];

        if (postType == null || !content) {
          return res.json({
            status: 0,
            message: "Not enough information.",
          });
        }
        let post = await model.Post.create({
          ownerID: mongoose.Types.ObjectId(user._id),
          postType: postType,
          dateTime: new Date(),
          content: content,
        });

        let { image } = files;
        const imgStream = fs.readFileSync(image[0].path);
        const location = await uploadImage(
          imgStream,
          `posts/${post._id}/${image[0].originalFilename}`
        );
        post = await model.Post.findOneAndUpdate(
          {
            _id: post._id,
          },
          {
            $set: {
              image: location,
            },
          },
          { new: true }
        );

        return res.json({
          status: 1,
          message: "Post successfully.",
          data: post,
        });
      });
    } catch (error) {
      return res.json({
        status: 0,
        message: "Unexpected error." + error,
      });
    }
  },
  commentPost: async (req, res) => {
    try {
      const user = await model.User.findById(req.user.id);
      if (!user) {
        return res.json({
          status: 0,
          message: "Not valid user.",
        });
      }
      let { postID, content } = req.body;

      if (!content || !postID) {
        return res.json({
          status: 0,
          message: "Not enough information.",
        });
      }

      const comment = new model.Comment({
        userID: mongoose.Types.ObjectId(user._id),
        postID: postID,
        dateTime: Date(),
        content: content,
      });

      await comment
        .save()
        .then((doc) => {
          console.log(doc);
        })
        .catch((err) => {
          console.error(err);
        });

      return res.json({
        status: 1,
        message: "Comment successfully.",
        data: {
          _id: comment._id,
          content: comment.content,
          dateTime: comment.dateTime,
          name: user.fullname,
          avatar: user.avatar,
        },
      });
    } catch (error) {
      return res.json({
        status: 0,
        message: "Unexpected error.",
      });
    }
  },
  getPostList: async (req, res) => {
    try {
      const user = await model.User.findById(req.user.id);
      if (!user) {
        return res.json({
          status: 0,
          message: "Not valid user.",
        });
      }

      let { type } = req.body;

      if (type == null) {
        return res.json({
          status: 0,
          message: "Type must not be empty.",
        });
      }

      // Set limit 20 posts per request
      const limit = 20;
      const { cursor } = req.query;

      let cursorQuery = {};

      if (cursor) {
        cursorQuery = {
          _id: {
            $lt: cursor,
          },
        };
      }

      posts = await model.Post.find({ cursorQuery, postType: type })
        .sort({ id: -1 })
        .limit(limit);
      if (type) {
        posts = await model.Post.find({
          cursorQuery,
          ownerID: user._id,
          postType: type,
        })
          .sort({ id: -1 })
          .limit(limit);
      }

      const postFeed = await Promise.all(
        posts.map(async (post) => {
          const owner = await model.User.findById(post.ownerID);
          const numLike = await model.Like.find({ postID: post._id }).count();

          const comments = await model.Comment.find({ postID: post._id });
          const returnedComments = [];
          for (let i = 0; i < comments.length; i++) {
            const commentUser = await model.User.findById(comments[i].userID);
            let tmpComment = {
              _id: comments[i]._id,
              content: comments[i].content,
              dateTime: comments[i].dateTime,
              name: commentUser.fullname,
              avatar: commentUser.avatar,
            };
            returnedComments.push(tmpComment);
          }

          return {
            _id: post._id,
            owner: {
              _id: owner._id,
              avatar: owner.avatar,
              name: owner.fullname,
            },
            dateTime: post.dateTime,
            content: post.content,
            image: post.image,
            numLike: numLike,
            comments: returnedComments,
          };
        })
      );

      let newCursor = "";
      if (posts.length > 0) {
        newCursor = posts[posts.length - 1]._id;
      }

      return res.json({
        status: 1,
        message: "Successful post feed retrieval.",
        data: {
          postFeed,
          cursor: newCursor,
        },
      });
    } catch (error) {
      console.log(error);
      return res.json({
        status: 0,
        message: "Unexpected error.",
      });
    }
  },
  toggleLike: async (req, res) => {
    try {
      const user = await model.User.findById(req.user.id);
      if (!user) {
        return res.json({
          status: 0,
          message: "Not valid user.",
        });
      }

      let { postID } = req.body;

      if (!postID) {
        return res.json({
          status: 0,
          message: "Not enough information.",
        });
      }

      const isLiked = await model.Like.find({
        userID: user._id,
        postID: postID,
      }).count();

      if (isLiked <= 0) {
        const like = new model.Like({
          userID: mongoose.Types.ObjectId(user._id),
          postID: postID,
        });

        await like
          .save()
          .then((doc) => {
            console.log(doc);
          })
          .catch((err) => {
            console.error(err);
          });
      } else {
        await model.Like.deleteOne({ userID: user._id, postID: postID });
      }
      numLike = await model.Like.find({ postID: postID }).count();
      return res.json({
        status: 1,
        message: "Toggle successfully",
        numLike: numLike,
      });
    } catch (error) {
      return res.json({
        status: 0,
        message: "Unexpected error.",
      });
    }
  },
  getComment: async (req, res) => {
    try {
      let { postID } = req.body;

      if (!postID) {
        return res.json({
          status: 0,
          message: "PostID must not be empty",
        });
      }

      // Set limit 20 comments per request
      const limit = 20;
      const { cursor } = req.query;

      let cursorQuery = {};

      if (cursor) {
        cursorQuery = {
          _id: {
            $lt: cursor,
          },
        };
      }

      const comments = await model.Comment.find({ cursorQuery, postID: postID })
        .sort({ id: -1 })
        .limit(limit);

      const commentFeed = await Promise.all(
        comments.map(async (comment) => {
          const owner = await model.User.findById(comment.userID);
          return {
            _id: comment._id,
            ownerID: {
              _id: comment.userID,
              name: owner.fullname,
            },
            dateTime: comment.dateTime,
            content: comment.content,
          };
        })
      );

      let newCursor = "";
      if (comments.length > 0) {
        newCursor = comments[comments.length - 1]._id;
      }

      return res.json({
        status: 1,
        message: "Successful post feed retrieval.",
        data: {
          commentFeed,
          cursor: newCursor,
        },
      });
    } catch (error) {
      return res.json({
        status: 0,
        message: "Unexpected error.",
      });
    }
  },
};
