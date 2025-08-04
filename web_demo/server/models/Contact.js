const mongoose = require("mongoose");

// Contact schema
const contactSchema = new mongoose.Schema({
  fullName: String,
  email: String,
  queryRelated: String,
  message: String,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Contact", contactSchema);
