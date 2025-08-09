const Contact = require("../models/Contact");
const User = require("../models/User");
const AuditLog = require("../models/AuditLog");
const Notification = require("../models/Notification");

class ContactService {
  static async getAllContacts({ page = 1, limit = 10, userRole }) {
    if (userRole !== "Admin") {
      throw new Error("Unauthorized");
    }

    const skip = (page - 1) * limit;
    const contacts = await Contact.find({ isDeleted: false })
      .populate("userId", "username email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select("userId subject message status createdAt");
    const total = await Contact.countDocuments({ isDeleted: false });
    return { contacts, total, page, limit };
  }

  static async getContactById(contactId, userRole) {
    if (userRole !== "Admin") {
      throw new Error("Unauthorized");
    }

    const contact = await Contact.findOne({ _id: contactId, isDeleted: false })
      .populate("userId", "username email")
      .select("userId subject message status createdAt");
    if (!contact) throw new Error("Contact not found");
    return contact;
  }

  static async createContact({ userId, username, subject, message }) {
    const contact = new Contact({
      userId,
      subject,
      message,
      status: "pending",
    });
    await contact.save();

    await AuditLog.logAction({
      userId,
      action: "create",
      resource: "Contact",
      resourceId: contact._id,
      details: `Created contact request: ${subject}`,
    });

    const admins = await User.find({ role: "Admin", isDeleted: false });
    const notifications = admins.map((admin) => ({
      userId: admin.uid,
      type: "contact_created",
      relatedId: contact._id,
      message: `${username} submitted a new contact request: ${subject}`,
    }));
    await Notification.insertMany(notifications);

    return contact;
  }

  static async updateContactStatus({ contactId, status, userId, userRole }) {
    if (userRole !== "Admin") {
      throw new Error("Unauthorized");
    }

    const validStatuses = ["pending", "resolved", "closed"];
    if (!validStatuses.includes(status)) throw new Error("Invalid status");

    const contact = await Contact.findOne({ _id: contactId, isDeleted: false });
    if (!contact) throw new Error("Contact not found");

    contact.status = status;
    await contact.save();

    await AuditLog.logAction({
      userId,
      action: "update",
      resource: "Contact",
      resourceId: contact._id,
      details: `Updated contact status to ${status} for request: ${contact.subject}`,
    });

    if (contact.userId) {
      const user = await User.findOne({
        uid: contact.userId,
        isDeleted: false,
      });
      if (user) {
        await Notification.create({
          userId: contact.userId,
          type: "contact_status_updated",
          relatedId: contact._id,
          message: `Your contact request "${contact.subject}" has been updated to ${status}`,
        });
      }
    }

    return contact;
  }

  static async deleteContact({ contactId, userId, userRole }) {
    if (userRole !== "Admin") {
      throw new Error("Unauthorized");
    }

    const contact = await Contact.findOne({ _id: contactId, isDeleted: false });
    if (!contact) throw new Error("Contact not found");

    await Contact.updateOne({ _id: contactId }, { isDeleted: true });

    await AuditLog.logAction({
      userId,
      action: "soft_delete",
      resource: "Contact",
      resourceId: contact._id,
      details: `Deleted contact request: ${contact.subject}`,
    });

    return { message: "Contact deleted" };
  }

  static async getContactsByUser({ userId, page = 1, limit = 10 }) {
    const user = await User.findOne({ uid: userId, isDeleted: false });
    if (!user) throw new Error("User not found");

    const skip = (page - 1) * limit;
    const contacts = await Contact.find({ userId, isDeleted: false })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select("subject message status createdAt");
    const total = await Contact.countDocuments({ userId, isDeleted: false });
    return { contacts, total, page, limit };
  }
}

module.exports = ContactService;
