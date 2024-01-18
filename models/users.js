const mongoose = require('mongoose');
const crypto = require('crypto')

const { Schema, ObjectId } = mongoose;

const UsersSchema = new Schema({
    email: { 
        type: String, 
        require: true, 
        unique: true 
    },
    password: { 
        type: String, 
        require: true 
    },
    phone: { type: String },
    facebook: {
        email: { type: String },
        id: { type: String },
        name: { type: String },
        token: { type: String },
    },
    username: { 
        type: String,
        default: `User_${Math.floor(Math.random() * (999999999-1000+1)) + 1000}`
    },
    avatar: { type: String },
    bio: { type: String },
    gender: { type: String, enum: ['Male', ' Female'] },
    followers: [{ type: Schema.Types.ObjectId, }],
    following: [{ type: Schema.Types.ObjectId, }],
    posts: [{ type: Schema.Types.ObjectId }],
    refreshToken: { type: String },
    passwordChangedAt: { type: String },
    passwordResetToken: { type: String },
    passwordTokenExpires: { type: String },
});

UsersSchema.methods = {
    createPasswordChangedToken: function(){
        const resetToken = crypto.randomBytes(32).toString('hex')
        this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex')
        this.passwordTokenExpires = Date.now() + 5 * 60 * 1000
        return resetToken
    }
}

const Users = mongoose.model('Users', UsersSchema);
module.exports = Users;

