const Post = require("../models/post");
const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const fs = require("fs").promises;
const path = require("path");

const createPost = asyncHandler(async (req, res) => {
  const { text, title } = req.body;
  const userId = req.user;
  const createdPost = await Post.create({ userId, text, title });
  return res.status(201).json({ msg: "post created successfully" });
});
const postDetail = asyncHandler(async (req, res) => {
  const postId = req.params.postId;
  const post = await Post.aggregate([
    {
      $match: {
        _id: new ObjectId(postId),
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "userId",
        foreignField: "_id",
        as: "author",
      },
    },
    { $unwind: "$author" },
    {
      $project: {
        "author.name": 1,
        "author.username": 1,
        "author.profilepic": 1,
        text: 1,
        title: 1,
        createdAt: 1,
        updatedAt: 1,
      },
    },
  ]);
  if (post.length >= 1) {
    return res.status(200).json({ post });
  }
  req.statusCode = 400;
  throw new Error("Post not accessable");
});
const updatePost = asyncHandler(async (req, res) => {
  const { text, title } = req.body;
  const postId = req.params.postId;

  const newPost = await Post.findOneAndUpdate(
    { _id: postId },
    { text, title },
    {
      new: true,
    }
  );
  if (newPost) {
    return res.status(200).json({ msg: "updated post successfully" });
  }
  return res.status(400).json({ msg: "Post cannot be updated" });
});
const deletePost = asyncHandler(async (req, res, next) => {
  const postId = req.params.postId;
  const post = await Post.findOneAndDelete({  _id: postId });
  if (post) {
    return res.status(200).json({ msg: "post deleted successfully" });
  }
  req.statusCode = 400;
  throw new Error("Post not found");
});

const getAllUserPosts = asyncHandler(async (req, res) => {
  const defaultPage = 0;
  const defaultDocs = 10;
  const docsPerPage = parseInt(req.query.limit) || defaultDocs;
  const currentPage = parseInt(req.query.page) || defaultPage;
  const userId = req.user;
  const posts = await Post.aggregate([
    {
      $match: {
        userId: new ObjectId(userId),
      },
    },

    { $sort: { createdAt: -1, _id: 1 } },
    { $skip: docsPerPage * currentPage },
    { $limit: docsPerPage },
    {
      $project: {
        userId: 0,
      },
    },
  ]);
  return res.status(200).json({ posts });
});

const getTimeLinePosts = asyncHandler(async (req,res) => {
  const defaultPage = 0;
  const defaultDocs = 10;
  const docsPerPage = parseInt(req.query.limit) || defaultDocs;
  const currentPage = parseInt(req.query.page) || defaultPage;
  const posts = await Post.aggregate([
    { $sort: { createdAt: -1, _id: 1 } },
    { $skip: docsPerPage * currentPage },
    { $limit: docsPerPage },
    {
      $project: {
        userId: 0,
      },
    },
  ]);
  return res.status(200).json({ posts });
})

module.exports = {
  createPost,
  updatePost,
  deletePost,
  postDetail,
  getAllUserPosts,
  getTimeLinePosts
};
