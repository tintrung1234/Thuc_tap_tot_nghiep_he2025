const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, ref: "User", index: true },
    type: {
      type: String,
      required: true,
      enum: [
        "like",
        "comment",
        "share",
        "follow",
        "mention",
        "contact_created",
        "term_created",
        "policy_created",
      ],
      index: true,
    },
    relatedId: { type: String, required: true, index: true }, // ID of related resource (Post, Comment, etc.)
    message: { type: String, required: true, maxlength: 200 },
    isRead: { type: Boolean, default: false, index: true },
    isDeleted: { type: Boolean, default: false }, // Soft delete
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Notification", notificationSchema);
