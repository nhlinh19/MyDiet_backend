const express = require("express");
const getUser = require("../middleware");
const userRouter = express.Router();
const userResolver = require("../resolvers/user");

userRouter.get("/", getUser, userResolver.me);
userRouter.post("/signup", userResolver.signUp);
userRouter.post("/signin", userResolver.signIn);
userRouter.post("/update", getUser, userResolver.updateUser);
userRouter.post("/change_password", getUser, userResolver.changePassword);
userRouter.post("/update_request", getUser, userResolver.requestTobeDietitian);
userRouter.post("/register_dietitian", getUser, userResolver.registerDietitian);
userRouter.get(
  "/personal_dietitian",
  getUser,
  userResolver.myPersonalDietitian
);
userRouter.post("/upload_avatar", getUser, userResolver.uploadAvatar);
userRouter.get("/client_list", getUser, userResolver.clientList);
userRouter.get("/dietitian_list", getUser, userResolver.dietitianList);
userRouter.get("/request_list", getUser, userResolver.requestList);
userRouter.post("/add_dietitian", getUser, userResolver.addDietitian);
userRouter.post("/remove_dietitian", getUser, userResolver.removeDietitian);

module.exports = userRouter;
