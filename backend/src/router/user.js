const express = require("express");
const {
  registerUser,
  updateUser,
  userDetail,
  loginUser,
  logoutUser,
} = require("../controller/user");
const {
  registerUserSchema,
  loginUserSchema,
} = require("../validation/uservalidation");
const { uploadProfilePic } = require("../middleware/fileupload");

const authMiddleware = require("../middleware/auth");

const router = express.Router();
router
  .route("/register")
  .post(
    uploadProfilePic.single("profilepic"),
    registerUserSchema,
    registerUser
  );
router.route("/login").post(loginUserSchema, loginUser);
router.route("/logout").post(authMiddleware, logoutUser);
router
  .route("/edit")
  .patch(authMiddleware, uploadProfilePic.single("profilepic"), updateUser);
router.route("/detail").get(authMiddleware, userDetail);

module.exports = router;
