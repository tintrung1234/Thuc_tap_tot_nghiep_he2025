const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    postId: { type: String, required: true, ref: "Post", index: true },
    userId: { type: String, required: true, ref: "User", index: true },
    content: { type: String, required: true, trim: true, maxlength: 1000 },
    parentId: { type: String, ref: "Comment", default: null },
    reactions: [
      {
        userId: { type: String, required: true, ref: "User" },
        type: {
          type: String,
          enum: ["like", "haha", "love", "wow", "sad", "angry"],
          required: true,
        },
      },
    ],
    isDeleted: { type: Boolean, default: false }, // Soft delete
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Comment", commentSchema);
