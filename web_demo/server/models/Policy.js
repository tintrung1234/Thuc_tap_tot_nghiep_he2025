const mongoose = require("mongoose");

// New Terms and Conditions schema
const policySchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  sectionType: {
    type: String,
    enum: [
      "policy",
      "activity",
      "identity",
      "content",
      "information",
      "phishing",
      "regulated",
      "spam",
    ],
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Policy", policySchema);
