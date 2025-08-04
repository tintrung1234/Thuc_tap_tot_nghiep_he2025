const express = require("express");
const cors = require("cors");

const postRoutes = require("./routes/postRoutes");
const contactRoutes = require("./routes/contactRoutes");
const termsRoutes = require("./routes/termsRoutes");
const policyRoutes = require("./routes/policyRoutes");
const userRoutes = require("./routes/userRoutes");

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/posts", postRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/terms", termsRoutes);
app.use("/api/policy", policyRoutes);
app.use("/api/users", userRoutes);

module.exports = app;
