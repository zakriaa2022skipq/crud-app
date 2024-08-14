const jwt = require("jsonwebtoken");
const User = require("../models/user");
const asyncHandler = require("express-async-handler");
const { hashPassword, verifyPassword } = require("../util/password");
require("../util/loggers");
const winston = require("winston");

const AuthLogger = winston.loggers.get("AuthLogger");

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, username } = req.body;
  const userExists = await User.findOne({
    $or: [{ email }, { username }],
  });
  if (userExists) {
    req.statusCode = 400;
    throw new Error("User with this username or email already exists");
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
  });
  return res.status(201).json({ msg: "user registered successfully" });
});
const loginUser = asyncHandler(async (req, res) => {
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
  const token = jwt.sign({ id: userExists._id }, process.env.JWT_SECRET);
  return res
    .cookie("access_token", token, {
      httpOnly: true,
      secure: true,
      sameSite:'none',
      
    })
    .status(200)
    .json({ msg: "Logged in successfully" });
});
const logoutUser = asyncHandler(async (req, res, next) => {
  return res
    .clearCookie("access_token")
    .status(200)
    .json({ msg: "Successfully logged out" });
});
const userDetail = asyncHandler(async (req, res) => {
  const userDetail = await User.findById(req.user).select(["-password"]);
  return res.status(200).json({ userDetail });
});
const updateUser = asyncHandler(async (req, res) => {
  const { username, email, password, name } = req.body;
  if (!username && !email && !password && !name && !req.file) {
    req.statusCode = 400;
    throw new Error("Specify the fields to be updated");
  }
  let update = {};
  if (username) {
    update.username = username;
  }
  if (email) {
    update.email = email;
  }
  if (password) {
    const hashedPassword = await hashPassword(password);
    update.password = hashedPassword;
  }
  if (name) {
    update.name = name;
  }
  if (req.file) {
    update.profilepic = req.file.filename;
  }

  const userDetail = await User.findOneAndUpdate({ _id: req.user }, update, {
    new: true,
    select: ["-password"],
  });
  return res.status(200).json({ userDetail });
});

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  userDetail,
  updateUser,
};
