const mongoose = require("mongoose");
const axios = require("axios");

const postSchema = new mongoose.Schema(
  {
    uid: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
      index: true,
    },
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
    isDeleted: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// Middleware để gửi data đến ETL API sau save
postSchema.post("save", async function (doc) {
  const etlUrl = "http://localhost:5001/etl/process"; // ETL API endpoint
  const action =
    doc.status === "published" && !doc.isDeleted ? "upsert" : "delete";
  const postData = {
    post_id: doc._id.toString(),
    title: doc.title,
    slug: doc.slug,
    content: doc.content,
    status: doc.status,
    isDeleted: doc.isDeleted,
  };

  try {
    await axios.post(etlUrl, { action, post: postData });
    console.log(`ETL processed: ${action} for post ${doc._id}`);
  } catch (error) {
    console.error(`ETL error: ${error.message}`);
  }
});

module.exports = mongoose.model("Post", postSchema);
