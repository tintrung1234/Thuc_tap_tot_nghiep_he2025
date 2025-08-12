const ContactService = require("../services/ContactService");

const createContact = async (req, res) => {
  try {
    const { fullName, email, queryRelated, message } = req.body;
    const { uid } = req.user;
    const contact = await ContactService.createContact({
      userId: uid,
      fullName: fullName,
      email: email,
      queryRelated: queryRelated,
      message: message,
    });
    res.status(201).json(contact);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getAllContacts = async (req, res) => {
  try {
    const { page, limit } = req.query;
    const { role } = req.user;
    const result = await ContactService.getAllContacts({
      page: parseInt(page),
      limit: parseInt(limit),
      userRole: role,
    });
    res.json(result);
  } catch (error) {
    res.status(403).json({ error: error.message });
  }
};

const getContactById = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.user;
    const contact = await ContactService.getContactById(id, role);
    res.json(contact);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

const updateContactStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const { uid, role } = req.user;
    const contact = await ContactService.updateContactStatus({
      contactId: id,
      status,
      userId: uid,
      userRole: role,
    });
    res.json(contact);
  } catch (error) {
    res.status(403).json({ error: error.message });
  }
};

const deleteContact = async (req, res) => {
  try {
    const { id } = req.params;
    const { uid, role } = req.user;
    const result = await ContactService.deleteContact({
      contactId: id,
      userId: uid,
      userRole: role,
    });
    res.json(result);
  } catch (error) {
    res.status(403).json({ error: error.message });
  }
};

const getContactsByUser = async (req, res) => {
  try {
    const { uid } = req.params;
    const { page, limit } = req.query;
    const result = await ContactService.getContactsByUser({
      userId: uid,
      page: parseInt(page),
      limit: parseInt(limit),
    });
    res.json(result);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

module.exports = {
  createContact,
  getAllContacts,
  getContactById,
  updateContactStatus,
  deleteContact,
  getContactsByUser,
};
