const mongoose = require("mongoose");

const reactionSchema = new mongoose.Schema(
  {
    postId: { type: String, required: true, ref: "Post", index: true },
    userId: { type: String, required: true, ref: "User", index: true },
    type: {
      type: String,
      enum: ["like", "haha", "love", "wow", "sad", "angry"],
      required: true,
    },
    isDeleted: { type: Boolean, default: false }, // Soft delete
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Reaction", reactionSchema);
