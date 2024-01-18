const mongoose = require('mongoose');

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
    posts: [{ type: Schema.Types.ObjectId, }],
    refreshToken: { type: String },
    passwordChangedAt: { type: String },
    passwordResetToken: { type: String },
});

const Users = mongoose.model('Users', UsersSchema);
module.exports = Users;

