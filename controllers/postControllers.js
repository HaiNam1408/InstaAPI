const Post = require("../models/posts");
const User = require("../models/users");
const asyncHandler = require("express-async-handler");

module.exports = postController = {
  getAllPost: asyncHandler(async (req, res) => {
    const response = await Post.find({});
    res.status(200).json(response);
  }),

  getPostById: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const post = await Post.findById(id);
    return res.status(200).json({
      success: post ? true : false,
      response: post ? post : "Something went wrong!",
    });
  }),

  create: asyncHandler(async (req, res) => {
    let postData = req.body;
    let { _id } = req.user;
    console.log(_id);
    if (!_id) throw new Error("Missing UserId");
    if (req.files) {
      let images = [];
      req.files.forEach((file) => {
        images.push({
          fieldname: file.fieldname,
          path: file.path,
          filename: file.filename,
        });
      });
      postData = {
        ...req.body,
        images: images,
      };
    }
    const user = await User.findOne({ _id: _id });
    if (user) {
      postData.userId = _id;
      const newPost = await Post.create(postData);
      user.posts.push(newPost.id);
      user.save();
      return res.status(200).json({
        success: newPost ? true : false,
        data: newPost ? newPost : "wrong!",
      });
    } else {
      return res.status(200).json({
        success: false,
        message: "Can't found user",
      });
    }
  }),

  getPostByUserId: asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (user) {
      const PostData = [];
      for (id of user.posts) {
        const post = await Post.findById(id);
        if (post) PostData.push(post);
      }
      return res.status(200).json({
        success: true,
        message: PostData,
      });
    } else
      return res.status(200).json({
        success: false,
        message: "Can't found user!",
      });
  }),

  update: asyncHandler(async (req, res) => {
    let postData = req.body;
    if (req.files) {
      let images = [];
      req.files.forEach((file) => {
        images.push({
          fieldname: file.fieldname,
          path: file.path,
          filename: file.filename,
        });
      });
      postData = {
        ...req.body,
        images: images,
      };
    }
    const post = await Post.findByIdAndUpdate(req.params.id, postData, {
      new: true,
    });
    return res.status(200).json({
      success: post ? true : false,
      message: post ? "Update post successfully!" : "Something went wrong!",
    });
  }),

  delete: asyncHandler(async (req, res) => {
    const pots = await Post.findByIdAndDelete(req.params.id);
    return res.status(200).json({
      success: pots ? true : false,
      message: pots ? "Delete post successfully!" : "Something went wrong!",
    });
  }),
};
