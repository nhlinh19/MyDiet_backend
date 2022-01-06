const model = require("../models");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const multiparty = require("multiparty");
const fs = require("fs");
const { gravatar, uploadImage } = require("../utils");

module.exports = {
  me: async (req, res) => {
    try {
      const user = await model.User.findById(req.user.id);
      if (!user) {
        return res.json({
          status: 0,
          message: "Not valid user.",
        });
      }

      user.password = undefined;
      user.ignored_list = undefined;

      return res.json({
        status: 1,
        data: user,
      });
    } catch (error) {
      return res.json({
        status: 0,
        message: "Unexpected error occurred.",
      });
    }
  },
  signUp: async (req, res) => {
    let { username, fullname, email, password, phoneNumber } = req.body;

    if (!username || !fullname || !email || !password) {
      return res.json({
        status: 0,
        message: "Not enough information.",
      });
    }

    const usernameExist = await model.User.findOne({ username });
    if (usernameExist) {
      return res.json({
        status: 0,
        message: "Username already exists.",
      });
    }
    email = email.trim().toLowerCase();
    const emailExist = await model.User.findOne({ email });
    if (emailExist) {
      return res.json({
        status: 0,
        message: "Email is already signed up.",
      });
    }

    if (password.length < 6) {
      return res.json({
        status: 0,
        message: "Password is too short.",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const avatar = gravatar(email);
    console.log(avatar);

    try {
      const user = new model.User({
        username,
        fullname,
        email,
        password: hashedPassword,
        phoneNumber,
        avatar,
        userType: 0,
        needUpgrade: false,
      });

      await user
        .save()
        .then((doc) => {
          console.log(doc);
        })
        .catch((err) => {
          console.error(err);
        });

      user.password = undefined;
      user.ignored_list = undefined;

      return res.json({
        status: 1,
        message: "Signed up successfully.",
        data: {
          token: jwt.sign(
            {
              id: user._id,
            },
            process.env.JWT_SECRET
          ),
          user,
        },
      });
    } catch (error) {
      return res.json({
        status: 0,
        message: "Unexpected error.",
      });
    }
  },
  signIn: async (req, res) => {
    let { username, password } = req.body;

    const user = await model.User.findOne({ username });
    console.log("vcl", username, password);
    if (!user) {
      return res.json({
        status: 0,
        message: "User does not exist.",
      });
    }
    console.log(user.password);
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.json({
        status: 0,
        message: "Wrong password.",
      });
    }

    user.password = undefined;
    user.ignored_list = undefined;

    return res.json({
      status: 1,
      message: "Signed in successfully.",
      data: {
        token: jwt.sign(
          {
            id: user._id,
          },
          process.env.JWT_SECRET
        ),
        user,
      },
    });
  },
  updateUser: async (req, res) => {
    const user = await model.User.findById(req.user.id);
    if (!user) {
      return res.json({
        status: 0,
        message: "Not valid user.",
      });
    }
    let { fullname, email, phoneNumber, about } = req.body;

    // Check for uniqueness
    if (email && email != user.email) {
      const existEmail = await model.User.findOne({ email });
      console.log(existEmail);
      if (existEmail) {
        return res.json({
          status: 0,
          message: "Email is already used by another account.",
        });
      }
    }

    try {
      // Make sure only given fields are updated.
      const updatedUser = await model.User.findOneAndUpdate(
        {
          _id: user._id,
        },
        {
          $set: {
            fullname: fullname || user.fullname,
            email: email || user.email,
            phoneNumber: phoneNumber || user.phoneNumber,
            about: about || user.about,
          },
        },
        {
          new: true,
        }
      );
      updatedUser.password = undefined;
      updatedUser.ignored_list = undefined;

      return res.json({
        status: 1,
        message: "Updated user successfully.",
        data: updatedUser,
      });
    } catch (error) {
      return res.json({
        status: 0,
        message: "Error in updating user.",
      });
    }
  },
  changePassword: async (req, res) => {
    const user = await model.User.findById(req.user.id);
    if (!user) {
      return res.json({
        status: 0,
        message: "Not valid user.",
      });
    }

    const { oldPassword, newPassword } = req.body;

    const correctOldPassword = await bcrypt.compare(oldPassword, user.password);
    if (!correctOldPassword) {
      return res.json({
        status: 0,
        message: "Incorrect old password.",
      });
    }

    if (newPassword.length < 6) {
      return res.json({
        status: 0,
        message: "New password is too short.",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    try {
      const updatedUser = await model.User.findOneAndUpdate(
        {
          _id: user._id,
        },
        {
          $set: {
            password: hashedPassword,
          },
        },
        {
          new: true,
        }
      );

      updatedUser.password = undefined;
      updatedUser.ignored_list = undefined;

      return res.json({
        status: 1,
        message: "Changed password successfully.",
        data: updatedUser,
      });
    } catch (error) {
      return res.json({
        status: 0,
        message: "Error in changing password.",
      });
    }
  },
  uploadAvatar: async (req, res) => {
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

        let avatar = files.avatar[0];
        if (!avatar) {
          return res.json({
            status: 0,
            message: "Cannot parse avatar image.",
          });
        }

        const avatarStream = await fs.readFileSync(avatar.path);
        const path = `users/avatar/${user._id}.${avatar.path.split(".").pop()}`;
        const location = await uploadImage(avatarStream, path);
        console.log(avatar.path);
        if (!location) {
          return res.json({
            status: 0,
            message: "Cannot upload avatar.",
          });
        }
        await model.User.findOneAndUpdate(
          {
            _id: user._id,
          },
          {
            $set: {
              avatar: location,
            },
          }
        );
        return res.json({
          status: 1,
          data: location,
          message: "Uploaded avatar successfully.",
        });
      });
    } catch (error) {
      return res.json({
        status: 0,
        message: "Cannot upload avatar.",
      });
    }
  },
  requestTobeDietitian: async (req, res) => {
    const user = await model.User.findById(req.user.id);
    if (!user) {
      return res.json({
        status: 0,
        message: "Not valid user.",
      });
    }

    if (user.userType != 0) {
      return res.json({
        status: 0,
        message: "Current account is not user account.",
      });
    }

    try {
      const updatedUser = await model.User.findOneAndUpdate(
        {
          _id: user._id,
        },
        {
          $set: {
            needUpgrade: true,
          },
        },
        {
          new: true,
        }
      );

      updatedUser.password = undefined;
      updatedUser.ignored_list = undefined;

      return res.json({
        status: 1,
        message: "Sending request to be dietitian successfully",
        data: updatedUser,
      });
    } catch (error) {
      return res.json({
        status: 0,
        message: "Error in requesting.",
      });
    }
  },
  registerDietitian: async (req, res) => {
    const user = await model.User.findById(req.user.id);
    if (!user) {
      return res.json({
        status: 0,
        message: "Not valid user.",
      });
    }

    if (user.userType != 0) {
      return res.json({
        status: 0,
        message: "Current account is not user account.",
      });
    }
    if (user.dietitianID) {
      return res.json({
        status: 0,
        message: "User has been assigned to a personal dietitian.",
      });
    }
    dietitianID = req.body._id;
    if (dietitianID) {
      const findDietitian = await model.User.findById(dietitianID);
      if (!findDietitian) {
        return res.json({
          status: 0,
          message: "Dietitian id is undefined.",
        });
      }
    } else {
      return res.json({
        status: 0,
        message: "Dietitian id is undefined.",
      });
    }

    try {
      const updatedUser = await model.User.findOneAndUpdate(
        {
          $and: [{ _id: user._id }, { userType: 0 }],
        },
        {
          $set: {
            dietitianID: dietitianID,
          },
        },
        {
          new: true,
        }
      );

      updatedUser.password = undefined;
      updatedUser.ignored_list = undefined;

      return res.json({
        status: 1,
        message: "Successfully register dietitian.",
        data: updatedUser,
      });
    } catch (error) {
      return res.json({
        status: 0,
        message: "Error in register dietitian.",
      });
    }
  },
  myPersonalDietitian: async (req, res) => {
    const user = await model.User.findById(req.user.id);
    if (!user) {
      return res.json({
        status: 0,
        message: "Not valid user.",
      });
    }

    if (user.userType != 0) {
      return res.json({
        status: 0,
        message: "Current account is not user account.",
      });
    }
    if (!user.dietitianID) {
      return res.json({
        status: 0,
        message: "User has not been assigned to a personal dietitian.",
      });
    }

    const dietitian = await model.User.findById(user.dietitianID);
    return res.json({
      status: 1,
      message: "Get personal dietitian successfully.",
      data: dietitian,
    });
  },
  clientList: async (req, res) => {
    const user = await model.User.findById(req.user.id);
    if (!user) {
      return res.json({
        status: 0,
        message: "Not valid user.",
      });
    }

    if (user.userType != 1) {
      return res.json({
        status: 0,
        message: "Current account is not dietitian account.",
      });
    }

    const cList = await model.User.find({
      $and: [{ dietitianID: user._id }, { userType: 0 }],
    });
    return res.json({
      status: 1,
      message: "Get client list successfully.",
      data: cList,
    });
  },
  dietitianList: async (req, res) => {
    const user = await model.User.findById(req.user.id);
    if (!user) {
      return res.json({
        status: 0,
        message: "Not valid user.",
      });
    }

    const dList = await model.User.find({ userType: 1 });
    return res.json({
      status: 1,
      message: "Get dietitian list successfully.",
      data: dList,
    });
  },
  requestList: async (req, res) => {
    const user = await model.User.findById(req.user.id);
    if (!user) {
      return res.json({
        status: 0,
        message: "Not valid user.",
      });
    }

    if (user.userType != 2) {
      return res.json({
        status: 0,
        message: "Current account is not admin account.",
      });
    }

    const rList = await model.User.find({
      $and: [{ userType: 0 }, { needUpgrade: true }],
    });
    return res.json({
      status: 1,
      message: "Get request list successfully.",
      data: rList,
    });
  },
  addDietitian: async (req, res) => {
    const user = await model.User.findById(req.user.id);
    if (!user) {
      return res.json({
        status: 0,
        message: "Not valid user.",
      });
    }

    if (user.userType != 2) {
      return res.json({
        status: 0,
        message: "Current account is not admin account.",
      });
    }
    const userID = req.body._id;
    if (userID) {
      const findUser = await model.User.findById(userID);
      if (!findUser) {
        return res.json({
          status: 0,
          message: "User id is undefined.",
        });
      }
    } else {
      return res.json({
        status: 0,
        message: "User id is undefined.",
      });
    }

    try {
      const updatedUser = await model.User.findOneAndUpdate(
        {
          $and: [{ _id: userID }, { userType: 0 }, { needUpgrade: true }],
        },
        {
          $set: {
            userType: 1,
            needUpgrade: false,
          },
        },
        {
          new: true,
        }
      );

      updatedUser.password = undefined;
      updatedUser.ignored_list = undefined;

      return res.json({
        status: 1,
        message: "Successfully add dietitian.",
        data: updatedUser,
      });
    } catch (error) {
      return res.json({
        status: 0,
        message: "Error in adding dietitian.",
      });
    }
  },
  removeDietitian: async (req, res) => {
    const user = await model.User.findById(req.user.id);
    if (!user) {
      return res.json({
        status: 0,
        message: "Not valid user.",
      });
    }

    if (user.userType != 2) {
      return res.json({
        status: 0,
        message: "Current account is not admin account.",
      });
    }
    dietitianID = req.body._id;
    if (dietitianID) {
      const findDietitian = await model.User.findById(dietitianID);
      if (!findDietitian) {
        return res.json({
          status: 0,
          message: "Dietitian id is undefined.",
        });
      }
    } else {
      return res.json({
        status: 0,
        message: "Dietitian id is undefined.",
      });
    }

    try {
      const updatedDietitian = await model.User.findOneAndUpdate(
        {
          $and: [{ _id: dietitianID }, { userType: 1 }],
        },
        {
          $set: {
            userType: 0,
          },
        },
        {
          new: true,
        }
      );
      const updatedUser = await model.User.updateMany(
        {
          $and: [{ dietitianID: dietitianID }, { userType: 0 }],
        },
        {
          $set: {
            dietitianID: null,
          },
        },
        {
          new: true,
        }
      );

      updatedDietitian.password = undefined;
      updatedDietitian.ignored_list = undefined;

      return res.json({
        status: 1,
        message: "Successfully remove dietitian.",
        data: updatedDietitian,
      });
    } catch (error) {
      return res.json({
        status: 0,
        message: "Error in removing dietitian.",
      });
    }
  },
  findDietitian: async (req, res) => {
    let { name } = req.body;
    try {
      list = await model.User.find({
        $and: [{ fullname: { $regex: name, $options: "i" } }, { userType: 1 }],
      }).limit(10);
      return res.json({
        status: 1,
        message: "List retrieved",
        data: list,
      });
    } catch (error) {
      return res.json({
        status: 0,
        message: "Cannot find dietitian",
      });
    }
  },
};
