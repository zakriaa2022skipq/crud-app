const express = require("express");
const {
  createPost,
  deletePost,
  updatePost,
  postDetail,
  getAllUserPosts,
  getTimeLinePosts,
} = require("../controller/post");
const authMiddleware = require("../middleware/auth");
const adminMiddleware = require("../middleware/admin");
const asyncHandler = require("../util/asyncHandler");

const router = express.Router();
router.route("/all").get(authMiddleware, getAllUserPosts);
router.route("/").post(authMiddleware, createPost);
router
  .route("/:postId")
  .put(authMiddleware,asyncHandler(adminMiddleware), updatePost)
  .delete(authMiddleware,asyncHandler(adminMiddleware), deletePost);

router.route("/detail/:postId").get(authMiddleware, postDetail);
router.route('/timeline').get(getTimeLinePosts)
module.exports = router;
