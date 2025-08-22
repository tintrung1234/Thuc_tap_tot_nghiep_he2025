const mongoose = require("mongoose");
const Post = require("../models/Post");
const Category = require("../models/Category");
const Tag = require("../models/Tag");
const User = require("../models/User");
const AuditLog = require("../models/AuditLog");
const Notification = require("../models/Notification");
const Share = require("../models/Share");
const Comment = require("../models/Comment");
const Reaction = require("../models/Reaction");
const cloudinary = require("../config/cloudinary");
const createError = require("http-errors");
const slugify = require("slugify");

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
        "title slug content description imageUrl category tags views createdAt status isDeleted"
      );
    const total = await Post.countDocuments({
      status: "published",
      isDeleted: false,
    });

    return { posts, total, page, limit };
  }

  static async searchPosts({ q, category, tags }) {
    let query = { isDeleted: false, status: "published" };

    if (q) {
      query.$or = [
        { title: { $regex: q, $options: "i" } },
        { description: { $regex: q, $options: "i" } },
        { content: { $regex: q, $options: "i" } },
      ];
    }

    if (category) {
      query.category = category;
    }

    if (tags) {
      query.tags = { $in: [tags] };
    }

    const posts = await Post.find(query)
      .populate("category", "_id name slug")
      .populate("tags", "_id name slug")
      .populate("uid", "_id username photoUrl");
    return posts;
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
        "title slug content description imageUrl category tags views createdAt"
      );
    const total = await Post.countDocuments({
      category: category._id,
      status: "published",
      isDeleted: false,
    });
    return { posts, total, page, limit };
  }

  static async getPostsByTags({ tagsSlug, page = 1, limit = 10 }) {
    const tags = await Tag.findOne({
      slug: tagsSlug,
      isDeleted: false,
    });
    if (!tags) throw new Error("Category not found");

    const skip = (page - 1) * limit;
    const posts = await Post.find({
      tags: tags._id,
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
        "title slug content description imageUrl category tags views createdAt"
      );
    const total = await Post.countDocuments({
      tags: tags._id,
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
      .populate("uid", "username photoUrl")
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
        "title slug content description imageUrl category tags views createdAt"
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
        "title slug content description imageUrl category tags views createdAt"
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
        "title slug content description content imageUrl category tags views createdAt"
      );

    if (!posts || posts.length === 0) {
      throw new Error("No recents posts found");
    }

    return posts;
  }

  static async createPost({
    uid,
    title,
    description,
    content,
    category,
    tags,
    image,
  }) {
    // Validate required fields
    if (!uid || !title || !description || !content || !category) {
      throw createError(400, "Vui lòng cung cấp đầy đủ các trường bắt buộc");
    }

    // Validate user
    const user = await User.findOne({ _id: uid, isDeleted: false });
    if (!user) {
      throw createError(404, "Người dùng không tồn tại");
    }

    const categoryDocs = await Category.findOne({
      _id: category,
      isDeleted: false,
    });
    if (!categoryDocs) throw new Error("Invalid or deleted category");

    // Validate tags
    if (tags && tags.length > 0) {
      const tagDocs = await Tag.find({ _id: { $in: tags }, isDeleted: false });
      if (tagDocs.length !== tags.length) {
        throw createError(400, "Một hoặc nhiều tag không hợp lệ");
      }
    }

    const slug = slugify(title, {
      lower: true,
      locale: "vi", // hỗ trợ tốt tiếng Việt
      strict: true, // bỏ ký tự đặc biệt
    });

    // Handle image upload
    let imageUrl = "";
    if (image) {
      try {
        const result = await cloudinary.uploader.upload(image.path, {
          folder: "posts",
        });
        imageUrl = result.secure_url;
      } catch (error) {
        throw createError(500, "Lỗi khi tải lên hình ảnh");
      }
    }

    // Create post
    const post = new Post({
      uid,
      title,
      slug,
      description,
      content,
      category,
      tags: tags || [],
      imageUrl,
      status: "published",
    });

    await post.save();

    await AuditLog.logAction({
      uid,
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
      message: `${user.username} created a new post: ${title}`,
    }));
    await Notification.insertMany(notifications);

    return post;
  }

  static async getPostsByUser({ uid, page = 1, limit = 10 }) {
    // Kiểm tra user tồn tại
    const user = await User.findOne({ uid: uid, isDeleted: false });
    if (!user) throw new Error("User not found");

    const skip = (page - 1) * limit;

    const posts = await Post.find({ uid: user._id, isDeleted: false })
      .populate("category", "name slug")
      .populate("tags", "name slug")
      .populate("uid", "name email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select(
        "title slug content description imageUrl category tags views shares createdAt"
      );

    const total = await Post.countDocuments({
      uid: user._id,
      isDeleted: false,
    });

    return { posts, total, page, limit };
  }

  static async updatePost(
    slug,
    { title, description, content, category, tags, image },
    user
  ) {
    const post = await Post.findOne({ slug, isDeleted: false });
    if (!post) throw new Error("Post not found");

    if (title) {
      post.title = title;
      const slug = slugify(title, {
        lower: true,
        locale: "vi", // hỗ trợ tốt tiếng Việt
        strict: true, // bỏ ký tự đặc biệt
      });

      const existingPost = await Post.findOne({
        slug,
        isDeleted: false,
        _id: { $ne: post._id },
      });
      if (existingPost) {
        slug = `${slug}-${Date.now()}`;
      }
      post.slug = slug;
    }
    if (description) post.description = description;
    if (content) post.content = content;
    if (category) {
      const categoryDoc = await Category.findById(category);
      if (!categoryDoc || categoryDoc.isDeleted) {
        throw createError(404, "Danh mục không tồn tại");
      }
      post.category = category;
    }
    if (tags && tags.length > 0) {
      const tagDocs = await Tag.find({ _id: { $in: tags }, isDeleted: false });
      if (tagDocs.length !== tags.length) {
        throw createError(400, "Một hoặc nhiều tag không hợp lệ");
      }
      post.tags = tags;
    } else if (tags) {
      post.tags = [];
    }

    if (image) {
      try {
        const result = await cloudinary.uploader.upload(image.path, {
          folder: "posts",
        });
        post.imageUrl = result.secure_url;
      } catch (error) {
        throw createError(500, "Lỗi khi tải lên hình ảnh");
      }
    }
    post.updatedAt = Date.now();
    await post.save();

    // Validate user
    const userFectch = await User.findOne({ _id: user.uid, isDeleted: false });
    if (!user) {
      throw createError(404, "Người dùng không tồn tại");
    }

    await AuditLog.logAction({
      userId: user.uid,
      action: "update",
      resource: "Post",
      resourceId: post._id,
      details: `Updated post with title: ${post.title}`,
    });

    const admins = await User.find({ role: "Admin", isDeleted: false });
    const notifications = admins.map((admin) => ({
      userId: admin.uid,
      type: "post_updated",
      relatedId: post._id,
      message: `${userFectch.username} updated post: ${title}`,
    }));
    await Notification.insertMany(notifications);

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

  static async getPostCounts(postIds) {
    const objectIds = postIds.map((id) => new mongoose.Types.ObjectId(id));

    const counts = await Promise.all([
      Comment.aggregate([
        { $match: { postId: { $in: objectIds }, isDeleted: false } },
        { $group: { _id: "$postId", count: { $sum: 1 } } },
      ]),
      Share.aggregate([
        { $match: { postId: { $in: objectIds }, isDeleted: false } },
        { $group: { _id: "$postId", count: { $sum: 1 } } },
      ]),
      Reaction.aggregate([
        { $match: { postId: { $in: objectIds }, isDeleted: false } },
        { $group: { _id: "$postId", count: { $sum: 1 } } },
      ]),
    ]);

    const [commentCounts, shareCounts, reactionCounts] = counts;

    return postIds.map((postId) => {
      const objId = new mongoose.Types.ObjectId(postId);

      return {
        postId: postId.toString(),
        comments: commentCounts.find((c) => c._id.equals(objId))?.count || 0,
        shares: shareCounts.find((s) => s._id.equals(objId))?.count || 0,
        reactions: reactionCounts.find((r) => r._id.equals(objId))?.count || 0,
      };
    });
  }
}

module.exports = PostService;
