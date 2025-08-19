const AuditLog = require("../models/AuditLog");
const User = require("../models/User");

class AuditLogService {
  static async getAllAuditLogs({
    page = 1,
    limit = 10,
    userId,
    resource,
    action,
    startDate,
    endDate,
    userRole,
  }) {
    if (userRole !== "Admin") {
      throw new Error("Unauthorized");
    }

    const skip = (page - 1) * limit;
    const query = { isDeleted: false };

    if (userId) query.userId = userId;
    if (resource) query.resource = resource;
    if (action) query.action = action;
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    const auditLogs = await AuditLog.find(query)
      .populate("userId", "username")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select("userId action resource resourceId details createdAt");
    const total = await AuditLog.countDocuments(query);
    return { auditLogs, total, page, limit };
  }

  static async getAuditLogById(logId, userRole) {
    if (userRole !== "Admin") {
      throw new Error("Unauthorized");
    }

    const auditLog = await AuditLog.findOne({ _id: logId, isDeleted: false })
      .populate("userId", "username")
      .select("userId action resource resourceId details createdAt");
    if (!auditLog) throw new Error("Audit log not found");
    return auditLog;
  }

  static async getAuditLogStats({
    userId,
    resource,
    startDate,
    endDate,
    userRole,
  }) {
    if (userRole !== "Admin") {
      throw new Error("Unauthorized");
    }

    const query = { isDeleted: false };
    if (userId) query.userId = userId;
    if (resource) query.resource = resource;
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    const stats = await AuditLog.aggregate([
      { $match: query },
      {
        $group: {
          _id: { userId: "$userId", resource: "$resource", action: "$action" },
          count: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "_id.userId",
          foreignField: "uid",
          as: "user",
        },
      },
      { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          userId: "$_id.userId",
          username: "$user.username",
          resource: "$_id.resource",
          action: "$_id.action",
          count: 1,
          _id: 0,
        },
      },
    ]);

    const total = await AuditLog.countDocuments(query);
    return { stats, total };
  }
}

module.exports = AuditLogService;
