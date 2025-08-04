const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  uid: { type: String, required: true, ref: "User" },
  title: { type: String, required: true },
  description: { type: String, required: true },
  imageUrl: { type: String, default: "" },
  category: { type: String, required: true },
  tags: [{ type: String }],
  createdAt: { type: Date, default: Date.now },
});

// Optional: enable full-text search
postSchema.index({
  title: "text",
  description: "text",
  category: "text",
  tags: "text",
});

module.exports = mongoose.model("Post", postSchema);
