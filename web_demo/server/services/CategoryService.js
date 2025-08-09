const Category = require("../models/Category");
const Post = require("../models/Post");
const User = require("../models/User");
const AuditLog = require("../models/AuditLog");
const Notification = require("../models/Notification");

class CategoryService {
  static async getAllCategories({ page = 1, limit = 10 }) {
    const skip = (page - 1) * limit;
    const categories = await Category.find({ isDeleted: false })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select("name slug description createdAt");
    const total = await Category.countDocuments({ isDeleted: false });
    return { categories, total, page, limit };
  }

  static async getCategoryBySlug(slug) {
    const category = await Category.findOne({ slug, isDeleted: false }).select(
      "name slug description createdAt"
    );
    if (!category) throw new Error("Category not found");
    return category;
  }

  static async createCategory({ name, description, userId, username }) {
    const existingCategory = await Category.findOne({ name, isDeleted: false });
    if (existingCategory) throw new Error("Category name already exists");

    const slug = name
      .toLowerCase()
      .replace(/ /g, "-")
      .replace(/[^\w-]+/g, "");
    const existingSlug = await Category.findOne({ slug, isDeleted: false });
    if (existingSlug) throw new Error("Category slug already exists");

    const category = new Category({ name, slug, description });
    await category.save();

    await AuditLog.logAction({
      userId,
      action: "create",
      resource: "Category",
      resourceId: category._id,
      details: `Created category: ${name}`,
    });

    const admins = await User.find({ role: "Admin", isDeleted: false });
    const notifications = admins.map((admin) => ({
      userId: admin.uid,
      type: "category_created",
      relatedId: category._id,
      message: `${username} created a new category: ${name}`,
    }));
    await Notification.insertMany(notifications);

    return category;
  }

  static async updateCategory({ slug, name, description, userId, userRole }) {
    if (userRole !== "Admin" && userRole !== "Moderator") {
      throw new Error("Unauthorized");
    }

    const category = await Category.findOne({ slug, isDeleted: false });
    if (!category) throw new Error("Category not found");

    if (name && name !== category.name) {
      const existingCategory = await Category.findOne({
        name,
        isDeleted: false,
      });
      if (existingCategory) throw new Error("Category name already exists");
      category.name = name;
      category.slug = name
        .toLowerCase()
        .replace(/ /g, "-")
        .replace(/[^\w-]+/g, "");
      const existingSlug = await Category.findOne({
        slug: category.slug,
        isDeleted: false,
      });
      if (
        existingSlug &&
        existingSlug._id.toString() !== category._id.toString()
      ) {
        throw new Error("Category slug already exists");
      }
    }
    if (description) category.description = description;

    await category.save();

    await AuditLog.logAction({
      userId,
      action: "update",
      resource: "Category",
      resourceId: category._id,
      details: `Updated category: ${category.name}`,
    });

    return category;
  }

  static async softDeleteCategory({ slug, userId, userRole }) {
    if (userRole !== "Admin" && userRole !== "Moderator") {
      throw new Error("Unauthorized");
    }

    const category = await Category.findOne({ slug, isDeleted: false });
    if (!category) throw new Error("Category not found");

    const postCount = await Post.countDocuments({
      category: category._id,
      isDeleted: false,
    });
    if (postCount > 0) {
      throw new Error(
        "Cannot delete category with active posts. Please delete or archive posts first."
      );
    }

    category.isDeleted = true;
    await category.save();

    await AuditLog.logAction({
      userId,
      action: "soft_delete",
      resource: "Category",
      resourceId: category._id,
      details: `Soft deleted category: ${category.name}`,
    });

    return { message: "Category soft deleted" };
  }

  static async restoreCategory({ slug, userId, userRole }) {
    if (userRole !== "Admin") {
      throw new Error("Unauthorized");
    }

    const category = await Category.findOneAndUpdate(
      { slug, isDeleted: true },
      { isDeleted: false, updatedAt: Date.now() },
      { new: true }
    );
    if (!category) throw new Error("Category not found");

    await AuditLog.logAction({
      userId,
      action: "restore",
      resource: "Category",
      resourceId: category._id,
      details: `Restored category: ${category.name}`,
    });

    const admins = await User.find({ role: "Admin", isDeleted: false });
    const notifications = admins.map((admin) => ({
      userId: admin.uid,
      type: "category_restored",
      relatedId: category._id,
      message: `${admin.username} restored category: ${category.name}`,
    }));
    await Notification.insertMany(notifications);

    return { message: "Category restored" };
  }
}

module.exports = CategoryService;
