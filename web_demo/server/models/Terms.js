const mongoose = require("mongoose");

// New Terms and Conditions schema
const termsSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  sectionType: {
    type: String,
    enum: ["terms"],
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Terms", termsSchema);
