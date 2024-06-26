const jwt = require("jsonwebtoken");
const User = require("../models/user");
const asyncHandler = require("express-async-handler");
const { hashPassword } = require("../util/password");
const nodemailer = require("nodemailer");

const requestPasswordReset = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    req.statusCode = 400;
    throw new Error("User with given email does not exist");
  }
  const resetToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
  const link = `${process.env.CLIENT_URL}/passwordreset?token=${resetToken}`;
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.MAIL,
      pass: process.env.MAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.MAIL,
    to: user.email,
    subject: "Password reset instructions",
    html: `<p>You requested to reset your password.</p>
      <p> Please, click the link below to reset your password</p>
      <a href="${link}">Reset Password</a>`,
  };
  try {
    const info = await transporter.sendMail(mailOptions);
  } catch (error) {
    req.statusCode = 500;
    throw new Error("Password reset link cannot be sent. Try again later");
  }
  res.status(200).json(link);
});

const passwordReset = asyncHandler(async (req, res) => {
  const token = req.body.token;
  const password = req.body.password;
  const data = jwt.verify(token, process.env.JWT_SECRET);
  const userId = data.id;
  const hashedPassword = await hashPassword(password);
  const updatedUser = await User.findOneAndUpdate(
    { _id: userId },
    { password: hashedPassword }
  );
  return res.status(200).json({ message: "Password reset was successful" });
});

module.exports = { passwordReset, requestPasswordReset };
