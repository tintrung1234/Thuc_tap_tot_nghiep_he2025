const mongoose = require("mongoose");

const auditLogSchema = new mongoose.Schema(
  {
    userId: { type: String, ref: "User", index: true }, // Nullable for system actions
    action: {
      type: String,
      required: true,
      enum: [
        "create",
        "update",
        "delete",
        "soft_delete",
        "restore",
        "login",
        "logout",
      ],
      index: true,
    },
    resource: {
      type: String,
      required: true,
      enum: [
        "User",
        "Post",
        "Category",
        "Comment",
        "Reaction",
        "Share",
        "Terms",
        "Policy",
        "Notification",
      ],
      index: true,
    },
    resourceId: { type: String, required: true, index: true },
    details: { type: String, default: "" }, // Additional details about the action
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: { createdAt: "createdAt", updatedAt: false } }
);

// Static method to log actions
auditLogSchema.statics.logAction = async function ({
  userId,
  action,
  resource,
  resourceId,
  details = "",
}) {
  try {
    await this.create({ userId, action, resource, resourceId, details });
  } catch (error) {
    console.error("Error logging action:", error);
  }
};

module.exports = mongoose.model("AuditLog", auditLogSchema);
