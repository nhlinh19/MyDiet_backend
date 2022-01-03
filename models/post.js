const mongoose = require("mongoose");

const postSchema = mongoose.Schema({
  //id????
  ownerID: {
    type: mongoose.Schema.Types.ObjectID,
    ref: "User",
    required: true,
  },
  postType: {
    type: Boolean, //true: private daily feed, false: shared board
    required: true,
  },
  dateTime: {
    type: Date,
    required: true,
  },
  content: {
    type: String,
  },
  image: {
    type: String, //path of the image save in cloud
  },
});

const Post = mongoose.model("Post", postSchema);
module.exports = Post;
