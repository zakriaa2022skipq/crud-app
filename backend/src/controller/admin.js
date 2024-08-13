const jwt = require("jsonwebtoken");
const User = require("../models/user");
const Post = require("../models/post");
const asyncHandler = require("express-async-handler");
const { hashPassword, verifyPassword } = require("../util/password");
const winston = require("winston");

const AuthLogger = winston.loggers.get("AuthLogger");
const registerAdmin = asyncHandler(async (req, res) => {
  const { name, email, password, username } = req.body;
  const userExists = await User.findOne({ username });
  if (userExists) {
    req.statusCode = 400;
    throw new Error("User with this username already exists");
  }
  const hashedPassword = await hashPassword(password);
  let profilepic = null;
  if (req.file) {
    profilepic = req.file.filename;
  }
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    username,
    profilepic,
    isAdmin: true,
  });
  return res.status(201).json({ msg: "admin user registered successfully" });
});
const loginAdmin = asyncHandler(async (req, res) => {
  const { password, username } = req.body;
  const userExists = await User.findOne({ username });
  if (!userExists) {
    req.statusCode = 400;
    throw new Error("Invalid username or password");
  }
  const isCorrectPassword = await verifyPassword(password, userExists.password);
  if (!isCorrectPassword) {
    AuthLogger.warn("Failed login attempt");
    req.statusCode = 400;
    throw new Error("Invalid username or password");
  }
  if (!userExists.isAdmin) {
    req.statusCode = 400;
    throw new Error("User is not admin");
  }
  const token = jwt.sign({ id: userExists._id }, process.env.JWT_SECRET);
  return res
    .cookie("access_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    })
    .status(200)
    .json({ msg: "Logged in successfully" });
});
const deleteUser = asyncHandler(async (req, res) => {
  const userId = req.params.id;
  const posts = await Post.deleteMany({ userId });
  const user = await User.findOneAndDelete({ _id: userId });
  if (!user) {
    req.statusCode = 400;
    throw new Error("User does not exist");
  } else {
    return res.status(200).json({ message: "User deleted" });
  }
});

const getLeaders = asyncHandler(async (req, res) => {
  const defaultPage = 0;
  const defaultDocs = 10;
  const docsPerPage = parseInt(req.query.limit) || defaultDocs;
  const currentPage = parseInt(req.query.page) || defaultPage;
  const users = await Post.aggregate([
    {
      $group: {
        _id: "$userId",
        posts: { $sum: 1 },
      },
    },
    { $sort: { posts: -1, _id: 1 } },
    { $skip: docsPerPage * currentPage },
    { $limit: docsPerPage },
    {
      $lookup: {
        from: "users",
        localField: "_id",
        foreignField: "_id",
        as: "user_data",
      },
    },
    {
      $set: {
        user_data: { $arrayElemAt: ["$user_data", 0] },
      },
    },
    {
      $project: {
        "user_data._id": 0,
        "user_data.password": 0,
        "user_data.isAdmin": 0,
      },
    },
  ]);

  return res.status(200).json({ users });
});
module.exports = {
  registerAdmin,
  loginAdmin,
  deleteUser,
  getLeaders,
};
