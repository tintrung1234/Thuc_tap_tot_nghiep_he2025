const mongoose = require("mongoose");

const shareSchema = new mongoose.Schema(
  {
    postId: { type: String, required: true, ref: "Post", index: true },
    userId: { type: String, required: true, ref: "User", index: true },
    sharedTo: {
      type: String,
      enum: ["profile", "facebook", "twitter", "linkedin"],
      default: "profile",
    },
    isDeleted: { type: Boolean, default: false }, // Soft delete
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Share", shareSchema);
