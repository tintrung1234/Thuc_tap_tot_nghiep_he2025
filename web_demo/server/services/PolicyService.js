const Policy = require("../models/Policy");
const User = require("../models/User");
const AuditLog = require("../models/AuditLog");
const Notification = require("../models/Notification");

class PolicyService {
  static async getAllPolicies({ page = 1, limit = 10 }) {
    const skip = (page - 1) * limit;
    const policies = await Policy.find({ isDeleted: false })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select("title content version createdAt");
    const total = await Policy.countDocuments({ isDeleted: false });
    return { policies, total, page, limit };
  }

  static async getPolicyById(policyId) {
    const policy = await Policy.findOne({
      _id: policyId,
      isDeleted: false,
    }).select("title content version createdAt");
    if (!policy) throw new Error("Policy not found");
    return policy;
  }

  static async createPolicy({
    title,
    content,
    version,
    userId,
    username,
    userRole,
  }) {
    if (userRole !== "Admin") {
      throw new Error("Unauthorized");
    }

    const policy = new Policy({ title, content, version });
    await policy.save();

    await AuditLog.logAction({
      userId,
      action: "create",
      resource: "Policy",
      resourceId: policy._id,
      details: `Created policy: ${title} (version ${version})`,
    });

    const users = await User.find({ isDeleted: false });
    const notifications = users.map((user) => ({
      userId: user.uid,
      type: "policy_created",
      relatedId: policy._id,
      message: `${username} created a new policy: ${title} (version ${version})`,
    }));
    await Notification.insertMany(notifications);

    return policy;
  }

  static async updatePolicy({
    policyId,
    title,
    content,
    version,
    userId,
    userRole,
  }) {
    if (userRole !== "Admin") {
      throw new Error("Unauthorized");
    }

    const policy = await Policy.findOne({ _id: policyId, isDeleted: false });
    if (!policy) throw new Error("Policy not found");

    if (title) policy.title = title;
    if (content) policy.content = content;
    if (version) policy.version = version;

    await policy.save();

    await AuditLog.logAction({
      userId,
      action: "update",
      resource: "Policy",
      resourceId: policy._id,
      details: `Updated policy: ${policy.title} (version ${policy.version})`,
    });

    const users = await User.find({ isDeleted: false });
    const notifications = users.map((user) => ({
      userId: user.uid,
      type: "policy_updated",
      relatedId: policy._id,
      message: `${username} updated policy: ${policy.title} (version ${policy.version})`,
    }));
    await Notification.insertMany(notifications);

    return policy;
  }

  static async deletePolicy({ policyId, userId, userRole }) {
    if (userRole !== "Admin") {
      throw new Error("Unauthorized");
    }

    const policy = await Policy.findOne({ _id: policyId, isDeleted: false });
    if (!policy) throw new Error("Policy not found");

    await Policy.updateOne({ _id: policyId }, { isDeleted: true });

    await AuditLog.logAction({
      userId,
      action: "soft_delete",
      resource: "Policy",
      resourceId: policy._id,
      details: `Deleted policy: ${policy.title} (version ${policy.version})`,
    });

    return { message: "Policy deleted" };
  }
}

module.exports = PolicyService;
