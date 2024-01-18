const jwt = require('jsonwebtoken')

const generateAccessToken  = (uid) => jwt.sign({_id: uid}, process.env.JWT_SECRET_KEY, { expiresIn: '7d' })
const generateRefreshToken  = (uid) => jwt.sign({_id: uid}, process.env.JWT_SECRET_KEY, { expiresIn: '7d' })

module.exports = {
    generateAccessToken,
    generateRefreshToken
}