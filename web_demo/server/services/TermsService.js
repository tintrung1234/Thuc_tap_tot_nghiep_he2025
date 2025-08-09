const Terms = require("../models/Terms");
const User = require("../models/User");
const AuditLog = require("../models/AuditLog");
const Notification = require("../models/Notification");

class TermsService {
  static async getAllTerms({ page = 1, limit = 10 }) {
    const skip = (page - 1) * limit;
    const terms = await Terms.find({ isDeleted: false })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select("title content version createdAt");
    const total = await Terms.countDocuments({ isDeleted: false });
    return { terms, total, page, limit };
  }

  static async getTermById(termId) {
    const term = await Terms.findOne({ _id: termId, isDeleted: false }).select(
      "title content version createdAt"
    );
    if (!term) throw new Error("Term not found");
    return term;
  }

  static async createTerm({
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

    const term = new Terms({ title, content, version });
    await term.save();

    await AuditLog.logAction({
      userId,
      action: "create",
      resource: "Terms",
      resourceId: term._id,
      details: `Created term: ${title} (version ${version})`,
    });

    const users = await User.find({ isDeleted: false });
    const notifications = users.map((user) => ({
      userId: user.uid,
      type: "term_created",
      relatedId: term._id,
      message: `${username} created a new term: ${title} (version ${version})`,
    }));
    await Notification.insertMany(notifications);

    return term;
  }

  static async updateTerm({
    termId,
    title,
    content,
    version,
    userId,
    userRole,
  }) {
    if (userRole !== "Admin") {
      throw new Error("Unauthorized");
    }

    const term = await Terms.findOne({ _id: termId, isDeleted: false });
    if (!term) throw new Error("Term not found");

    if (title) term.title = title;
    if (content) term.content = content;
    if (version) term.version = version;

    await term.save();

    await AuditLog.logAction({
      userId,
      action: "update",
      resource: "Terms",
      resourceId: term._id,
      details: `Updated term: ${term.title} (version ${term.version})`,
    });

    const users = await User.find({ isDeleted: false });
    const notifications = users.map((user) => ({
      userId: user.uid,
      type: "term_updated",
      relatedId: term._id,
      message: `${username} updated term: ${term.title} (version ${term.version})`,
    }));
    await Notification.insertMany(notifications);

    return term;
  }

  static async deleteTerm({ termId, userId, userRole }) {
    if (userRole !== "Admin") {
      throw new Error("Unauthorized");
    }

    const term = await Terms.findOne({ _id: termId, isDeleted: false });
    if (!term) throw new Error("Term not found");

    await Terms.updateOne({ _id: termId }, { isDeleted: true });

    await AuditLog.logAction({
      userId,
      action: "soft_delete",
      resource: "Terms",
      resourceId: term._id,
      details: `Deleted term: ${term.title} (version ${term.version})`,
    });

    return { message: "Term deleted" };
  }
}

module.exports = TermsService;
