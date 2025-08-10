const mongoose = require("mongoose");
const Post = require("../models/Post");
const Category = require("../models/Category");
const Tag = require("../models/Tag");
const User = require("../models/User");
const AuditLog = require("../models/AuditLog");
const Notification = require("../models/Notification");
const Share = require("../models/Share");
const cloudinary = require("../config/cloudinary");

class PostService {
  static async getAllPosts({ page = 1, limit = 10 }) {
    const skip = (page - 1) * limit;
    const posts = await Post.find({ status: "published", isDeleted: false })
      .populate("category", "name slug")
      .populate("uid", "username")
      .populate("tags", "name slug")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select(
        "title slug content description imageUrl category tags views shares createdAt"
      );
    const total = await Post.countDocuments({
      status: "published",
      isDeleted: false,
    });
    return { posts, total, page, limit };
  }

  static async searchPosts({ query, page = 1, limit = 10 }) {
    const skip = (page - 1) * limit;
    const posts = await Post.find(
      { $text: { $search: query }, status: "published", isDeleted: false },
      { score: { $meta: "textScore" } }
    )
      .populate("category", "name slug")
      .populate("uid", "username")
      .populate("tags", "name slug")
      .sort({ score: { $meta: "textScore" } })
      .skip(skip)
      .limit(limit)
      .select(
        "title slug content description imageUrl category tags views shares createdAt"
      );
    const total = await Post.countDocuments({
      $text: { $search: query },
      status: "published",
      isDeleted: false,
    });
    return { posts, total, page, limit };
  }

  static async getPostsByCategory({ categorySlug, page = 1, limit = 10 }) {
    const category = await Category.findOne({
      slug: categorySlug,
      isDeleted: false,
    });
    if (!category) throw new Error("Category not found");

    const skip = (page - 1) * limit;
    const posts = await Post.find({
      category: category._id,
      status: "published",
      isDeleted: false,
    })
      .populate("category", "name slug")
      .populate("uid", "username")
      .populate("tags", "name slug")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select(
        "title slug content description imageUrl category tags views shares createdAt"
      );
    const total = await Post.countDocuments({
      category: category._id,
      status: "published",
      isDeleted: false,
    });
    return { posts, total, page, limit };
  }

  static async getPostBySlug(slug) {
    const post = await Post.findOneAndUpdate(
      { slug, isDeleted: false },
      { $inc: { views: 1 } },
      { new: true }
    )
      .populate("category", "name slug")
      .populate("uid", "username")
      .populate("tags", "name slug");
    if (!post) throw new Error("Post not found");
    return post;
  }

  static async getTopPost() {
    const post = await Post.findOne({ status: "published", isDeleted: false })
      .populate("category", "name slug")
      .populate("uid", "username")
      .populate("tags", "name slug")
      .sort({ views: -1 })
      .select(
        "title slug content description imageUrl category tags views shares createdAt"
      );
    if (!post) throw new Error("No posts found");
    return post;
  }

  static async getFeaturedPosts(limit = 5) {
    const posts = await Post.find({
      status: "published",
      isDeleted: false,
    })
      .populate("category", "name slug")
      .populate("uid", "username")
      .populate("tags", "name slug")
      .sort({ shares: -1 })
      .limit(limit)
      .select(
        "title slug content description imageUrl category tags views shares createdAt"
      );

    if (!posts || posts.length === 0) {
      throw new Error("No featured posts found");
    }

    return posts;
  }

  static async getRecentPosts({ limit = 15 }) {
    const posts = await Post.find({ status: "published", isDeleted: false })
      .populate("category", "name slug")
      .populate("uid", "username")
      .populate("tags", "name slug")
      .sort({ createdAt: -1 })
      .limit(limit)
      .select(
        "title slug content description content imageUrl category tags views shares createdAt"
      );

    if (!posts || posts.length === 0) {
      throw new Error("No recents posts found");
    }

    return posts;
  }

  static async createPost({
    title,
    description,
    content,
    categoryId,
    tagIds,
    file,
    userId,
    username,
  }) {
    const category = await Category.findOne({
      _id: categoryId,
      isDeleted: false,
    });
    if (!category) throw new Error("Invalid or deleted category");

    const tags = await Tag.find({ _id: { $in: tagIds }, isDeleted: false });
    if (tags.length !== tagIds.length)
      throw new Error("One or more tags are invalid or deleted");

    const slug = title
      .toLowerCase()
      .replace(/ /g, "-")
      .replace(/[^\w-]+/g, "");
    const postData = {
      uid: userId,
      title,
      slug,
      description,
      content,
      category: categoryId,
      tags: tagIds,
      status: "published",
    };

    if (file) {
      const result = await cloudinary.uploader.upload(file.path, {
        folder: "post_images",
        public_id: `post_${slug}_${Date.now()}`,
      });
      postData.imageUrl = result.secure_url;
    }

    const post = new Post(postData);
    await post.save();

    await AuditLog.logAction({
      userId,
      action: "create",
      resource: "Post",
      resourceId: post._id,
      details: `Created post with title: ${title}`,
    });

    const admins = await User.find({ role: "Admin", isDeleted: false });
    const notifications = admins.map((admin) => ({
      userId: admin.uid,
      type: "post_created",
      relatedId: post._id,
      message: `${username} created a new post: ${title}`,
    }));
    await Notification.insertMany(notifications);

    return post;
  }

  static async getPostsByUser({ uid, page = 1, limit = 10 }) {
    const user = await User.findOne({ uid, isDeleted: false });
    if (!user) throw new Error("User not found");

    const skip = (page - 1) * limit;
    const posts = await Post.find({ uid, isDeleted: false })
      .populate("category", "name slug")
      .populate("tags", "name slug")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select(
        "title slug content description imageUrl category tags views shares createdAt"
      );
    const total = await Post.countDocuments({ uid, isDeleted: false });
    return { posts, total, page, limit };
  }

  static async updatePost({
    slug,
    title,
    description,
    content,
    categoryId,
    tagIds,
    file,
    userId,
    currentUser,
  }) {
    const post = await Post.findOne({ slug, isDeleted: false });
    if (!post) throw new Error("Post not found");
    if (post.uid !== userId && currentUser.role !== "Admin") {
      throw new Error("Unauthorized");
    }

    if (title) post.title = title;
    if (description) post.description = description;
    if (content) post.content = content;
    if (categoryId) {
      const category = await Category.findOne({
        _id: categoryId,
        isDeleted: false,
      });
      if (!category) throw new Error("Invalid or deleted category");
      post.category = categoryId;
    }
    if (tagIds) {
      const tags = await Tag.find({ _id: { $in: tagIds }, isDeleted: false });
      if (tags.length !== tagIds.length)
        throw new Error("One or more tags are invalid or deleted");
      post.tags = tagIds;
    }

    if (file) {
      const result = await cloudinary.uploader.upload(file.path, {
        folder: "post_images",
        public_id: `post_${slug}_${Date.now()}`,
      });
      post.imageUrl = result.secure_url;
    }

    await post.save();

    await AuditLog.logAction({
      userId: currentUser.uid,
      action: "update",
      resource: "Post",
      resourceId: post._id,
      details: `Updated post with title: ${post.title}`,
    });

    return post;
  }

  static async softDeletePost({ slug, userId, currentUser }) {
    const post = await Post.findOne({ slug, isDeleted: false });
    if (!post) throw new Error("Post not found");
    if (post.uid !== userId && currentUser.role !== "Admin") {
      throw new Error("Unauthorized");
    }

    post.isDeleted = true;
    await post.save();

    await Share.updateMany(
      { postId: post._id, isDeleted: false },
      { isDeleted: true }
    );

    await AuditLog.logAction({
      userId: currentUser.uid,
      action: "soft_delete",
      resource: "Post",
      resourceId: post._id,
      details: `Soft deleted post with title: ${post.title}`,
    });

    return { message: "Post soft deleted" };
  }
}

module.exports = PostService;
