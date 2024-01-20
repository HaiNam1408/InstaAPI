const mongoose = require("mongoose");

const { Schema, ObjectId } = mongoose;

const PostsSchema = new Schema(
  {
    userId: { type: String },
    caption: { type: String },
    images: [
      {
        fieldname: { type: String },
        filename: { type: String },
        path: { type: String },
      },
    ],
    comments: [
      {
        comment: { type: String },
        create_at: { type: Date },
        userId: { type: Schema.Types.ObjectId },
      },
    ],
    like: { type: Number },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Posts", PostsSchema);
