const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')

const verifyToken = asyncHandler(async(req, res, next) => {
    if(req?.headers?.authorization?.startsWith('Bearer')) {
        const token = req.headers.authorization.split(' ')[1]
        jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decode) => {
            if(err) return res.status(401).json({
                success: false,
                massage: 'Invalid access token!'
            })
            req.user = decode
            next()
        })
    } else return res.status(401).json({
        success: false,
        massage: 'Require authentication!'
    })
})

module.exports = { verifyToken }