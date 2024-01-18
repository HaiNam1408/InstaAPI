const cloudinary = require('cloudinary').v2;
const Post = require('../models/posts')
const asyncHandler = require('express-async-handler')

const handleUpdateFile = asyncHandler(async(req, res, next) => {
    if(req.files) {
        const post = await Post.findOne({ _id: req.params.id })
        if(post) {
            for(file of post.images) {
                await cloudinary.uploader.destroy(file.filename, {resource_type: 'image'}) 
            }
        } else return res.status(200).json({
            success: false,
            message: "Cann't found post!"
        })
    }
    next()
})

module.exports = handleUpdateFile