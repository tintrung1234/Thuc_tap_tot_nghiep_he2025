const Tag = require("../models/Tag");
const Post = require("../models/Post");
const User = require("../models/User");
const AuditLog = require("../models/AuditLog");
const Notification = require("../models/Notification");

class TagService {
  static async getAllTags({ page = 1, limit = 10 }) {
    const skip = (page - 1) * limit;
    const tags = await Tag.find({ isDeleted: false })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select("name slug description createdAt");
    const total = await Tag.countDocuments({ isDeleted: false });
    return { tags, total, page, limit };
  }

  static async getTagBySlug(slug) {
    const tag = await Tag.findOne({ slug, isDeleted: false }).select(
      "name slug description createdAt"
    );
    if (!tag) throw new Error("Tag not found");
    return tag;
  }

  static async createTag({ name, description, userId }) {
    const existingTag = await Tag.findOne({ name, isDeleted: false });
    if (existingTag) throw new Error("Tag name already exists");

    const slug = name
      .toLowerCase()
      .replace(/ /g, "-")
      .replace(/[^\w-]+/g, "");
    const existingSlug = await Tag.findOne({ slug, isDeleted: false });
    if (existingSlug) throw new Error("Tag slug already exists");

    const tag = new Tag({ name, slug, description });
    await tag.save();

    const user = await User.findOne({ _id: userId, isDeleted: false });
    await AuditLog.logAction({
      userId,
      action: "create",
      resource: "Tag",
      resourceId: tag._id,
      details: `Created tag: ${name}`,
    });

    const admins = await User.find({ role: "Admin", isDeleted: false });
    const notifications = admins.map((admin) => ({
      userId: admin.uid,
      type: "tag_created",
      relatedId: tag._id,
      message: `${user.username} created a new tag: ${name}`,
    }));
    await Notification.insertMany(notifications);

    return tag;
  }

  static async updateTag({ slug, name, description, userId, userRole }) {
    if (userRole !== "Admin" && userRole !== "Moderator") {
      throw new Error("Unauthorized");
    }

    const tag = await Tag.findOne({ slug, isDeleted: false });
    if (!tag) throw new Error("Tag not found");

    if (name && name !== tag.name) {
      const existingTag = await Tag.findOne({ name, isDeleted: false });
      if (existingTag) throw new Error("Tag name already exists");
      tag.name = name;
      tag.slug = name
        .toLowerCase()
        .replace(/ /g, "-")
        .replace(/[^\w-]+/g, "");
      const existingSlug = await Tag.findOne({
        slug: tag.slug,
        isDeleted: false,
      });
      if (existingSlug && existingSlug._id.toString() !== tag._id.toString()) {
        throw new Error("Tag slug already exists");
      }
    }
    if (description) tag.description = description;

    await tag.save();

    await AuditLog.logAction({
      userId,
      action: "update",
      resource: "Tag",
      resourceId: tag._id,
      details: `Updated tag: ${tag.name}`,
    });

    return tag;
  }

  static async softDeleteTag({ slug, userId, userRole }) {
    if (userRole !== "Admin" && userRole !== "Moderator") {
      throw new Error("Unauthorized");
    }

    const tag = await Tag.findOne({ slug, isDeleted: false });
    if (!tag) throw new Error("Tag not found");

    const postCount = await Post.countDocuments({
      tags: tag._id,
      isDeleted: false,
    });
    if (postCount > 0) {
      throw new Error(
        "Cannot delete tag with active posts. Please remove tag from posts first."
      );
    }

    tag.isDeleted = true;
    await tag.save();

    await AuditLog.logAction({
      userId,
      action: "soft_delete",
      resource: "Tag",
      resourceId: tag._id,
      details: `Soft deleted tag: ${tag.name}`,
    });

    return { message: "Tag soft deleted" };
  }

  static async restoreTag({ slug, userId, userRole }) {
    if (userRole !== "Admin") {
      throw new Error("Unauthorized");
    }

    const tag = await Tag.findOneAndUpdate(
      { slug, isDeleted: true },
      { isDeleted: false, updatedAt: Date.now() },
      { new: true }
    );
    if (!tag) throw new Error("Tag not found");

    await AuditLog.logAction({
      userId,
      action: "restore",
      resource: "Tag",
      resourceId: tag._id,
      details: `Restored tag: ${tag.name}`,
    });

    const admins = await User.find({ role: "Admin", isDeleted: false });
    const notifications = admins.map((admin) => ({
      userId: admin.uid,
      type: "tag_restored",
      relatedId: tag._id,
      message: `${admin.username} restored tag: ${tag.name}`,
    }));
    await Notification.insertMany(notifications);

    return { message: "Tag restored" };
  }

  static async getPostsByTag({ tagSlug, page = 1, limit = 10 }) {
    const tag = await Tag.findOne({ slug: tagSlug, isDeleted: false });
    if (!tag) throw new Error("Tag not found");

    const skip = (page - 1) * limit;
    const posts = await Post.find({
      tags: tag._id,
      status: "published",
      isDeleted: false,
    })
      .populate("category", "name slug")
      .populate("uid", "username")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select("title slug description imageUrl category tags views createdAt");
    const total = await Post.countDocuments({
      tags: tag._id,
      status: "published",
      isDeleted: false,
    });
    return { posts, total, page, limit };
  }
}

module.exports = TagService;
