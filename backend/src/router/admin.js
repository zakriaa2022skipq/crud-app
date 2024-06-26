const express = require("express");
const adminMiddleware = require("../middleware/admin");
const { registerUserSchema } = require("../validation/uservalidation");
const { uploadProfilePic } = require("../middleware/fileupload");
const authMiddleware = require("../middleware/auth");
const {
  registerAdmin,
  deleteUser,
  getLeaders,
} = require("../controller/admin");
const asyncHandler = require("../util/asyncHandler");

const router = express.Router();
router
  .route("/register")
  .post(
    uploadProfilePic.single("profilepic"),
    registerUserSchema,
    registerAdmin
  );
router
  .route("/deleteuser/:id")
  .delete(authMiddleware, asyncHandler(adminMiddleware), deleteUser);
router
  .route("/leaderboard")
  .get(authMiddleware, asyncHandler(adminMiddleware), getLeaders);
module.exports = router;
