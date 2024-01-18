const cloudinary = require('cloudinary').v2;
const asyncHandler = require('express-async-handler');
const Post = require('../models/posts');

const handleDeleteFile = asyncHandler(async(req, res, next) => {
    const post = await Post.findOne({ _id: req.params.id })
    if(post) {
        for(file of post.images) {
            await cloudinary.uploader.destroy(file.filename, {resource_type: 'image'}) 
        }
    } else return res.status(200).json({
        success: false,
        message: "Cann't found post!"
    })
    next()
})

module.exports = handleDeleteFile