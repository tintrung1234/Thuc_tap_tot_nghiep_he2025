const express = require("express");
const cors = require("cors");

const postRoutes = require("./routes/postRoutes");
const contactRoutes = require("./routes/contactRoutes");
const termsRoutes = require("./routes/termsRoutes");
const policyRoutes = require("./routes/policyRoutes");
const userRoutes = require("./routes/userRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const tagRoutes = require("./routes/tagRoutes");
const reactionRoutes = require("./routes/reactionRoutes");
const commentRoutes = require("./routes/commentRoutes");
const shareRoutes = require("./routes/shareRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const auditLogRoutes = require("./routes/auditLogRoutes");
const statsRoutes = require("./routes/statsRoutes");

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/posts", postRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/terms", termsRoutes);
app.use("/api/policy", policyRoutes);
app.use("/api/users", userRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/tags", tagRoutes);
app.use("/api/reactions", reactionRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/shares", shareRoutes);
app.use("/api/contacts", contactRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/audit-logs", auditLogRoutes);
app.use("/api/stats", statsRoutes);

module.exports = app;
