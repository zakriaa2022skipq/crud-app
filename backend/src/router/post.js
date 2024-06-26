const express = require("express");
const {
  createPost,
  deletePost,
  updatePost,
  postDetail,
  getAllUserPosts,
} = require("../controller/post");
const authMiddleware = require("../middleware/auth");

const router = express.Router();
router.route("/all").get(authMiddleware, getAllUserPosts);
router.route("/").post(authMiddleware, createPost);
router
  .route("/:postId")
  .put(authMiddleware, updatePost)
  .delete(authMiddleware, deletePost);

router.route("/detail/:postId").get(authMiddleware, postDetail);
module.exports = router;
