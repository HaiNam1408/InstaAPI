const Post = require('../models/posts')
const asyncHandler = require('express-async-handler')

module.exports = postController = {
    getAllPost: asyncHandler(async (req, res) => {
        const response = await Post.find({})
        res.status(200).json(response)
    }),

    getPostById: asyncHandler(async (req, res) => {
        const { id } = req.params
        const post = await Post.findById(id)
        return res.status(200).json({
            success: post ? true : false,
            response: post ? post : "Something went wrong!"
        })
    }),

    create: asyncHandler(async(req,res) => {
        let postData = req.body
        if(req.files) {
            let images = []
            req.files.forEach(file => {
                images.push({
                    "fieldname": file.fieldname,
                    "path": file.path,
                    "filename": file.filename,
                })
            })
            postData = {
                ...req.body,
                images: images
            }
        }
        const newPost = await Post.create( postData )
        return res.status(200).json({
            success: postData ? true : false,
            data: postData ? postData : 'wrong!'
        })
    }),

    update: asyncHandler(async(req,res) => {
        let postData = req.body
        if(req.files) {
            let images = []
            req.files.forEach(file => {
                images.push({
                    "fieldname": file.fieldname,
                    "path": file.path,
                    "filename": file.filename,
                })
            })
            postData = {
                ...req.body,
                images: images
            }
        }
        const post = await Post.findByIdAndUpdate(req.params.id, postData, { new: true })
        return res.status(200).json({
            success: post? true : false,
            message: post? "Update post successfully!": "Something went wrong!"
        })
    }),

    delete: asyncHandler(async(req,res) => {
        const pots = await Post.findByIdAndDelete(req.params.id)
        return res.status(200).json({
            success: pots? true : false,
            message: pots? "Delete post successfully!": "Something went wrong!"
        })
    }),
}
