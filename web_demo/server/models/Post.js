const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    uid: { type: String, required: true, ref: "User", index: true },
    title: { type: String, required: true, trim: true, maxlength: 100 },
    slug: { type: String, required: true, unique: true, index: true },
    description: { type: String, required: true, maxlength: 500 },
    content: { type: String, required: true },
    imageUrl: { type: String, default: "" },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Category",
      index: true,
    },
    tags: [{ type: mongoose.Schema.Types.ObjectId, ref: "Tag", index: true }],
    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "draft",
    },
    views: { type: Number, default: 0 },
    shares: { type: Number, default: 0 },
    isDeleted: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// Add text index for search
postSchema.index({ title: "text", content: "text" });

module.exports = mongoose.model("Post", postSchema);
