const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
require('dotenv').config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET,
    resource_type: 'auto'
});

const storageOptions = {
    cloudinary: cloudinary,
    params: {
        folder: 'Instagram',
        resource_type: 'auto',
        allowed_formats: ['jpg', 'jpeg', 'png', 'mp4', 'jfif', 'webp'],
    }
};
const storage = new CloudinaryStorage(storageOptions)
const uploader = multer({ storage: storage })

module.exports = uploader;