const uploader = require("../configs/cloudinary.config.js")


const uploadFile = uploader.array('images', 20)

module.exports = uploadFile