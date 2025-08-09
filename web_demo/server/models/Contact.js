const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please use a valid email address"],
      index: true,
    },
    userId: {
      type: String,
      ref: "User",
      index: true,
      default: null, // Nullable for guest users
    },
    queryRelated: {
      type: String,
      required: true,
      enum: ["support", "feedback", "inquiry", "complaint", "other"],
      index: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000,
    },
    status: {
      type: String,
      enum: ["pending", "resolved", "ignored"],
      default: "pending",
      index: true,
    },
    response: {
      type: String,
      default: "",
      maxlength: 2000, // Admin's response to the contact
    },
    isDeleted: {
      type: Boolean,
      default: false, // Soft delete
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Contact", contactSchema);
