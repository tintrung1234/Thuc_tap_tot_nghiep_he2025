const mongoose = require("mongoose");

const termsSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    content: { type: String, required: true },
    sectionType: { type: String, enum: ["terms"], default: "terms" },
    version: { type: String, required: true, default: "1.0.0" },
    isActive: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Terms", termsSchema);
