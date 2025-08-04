const Contact = require("../models/Contact");

const contactPage = async (req, res) => {
  const { fullName, email, queryRelated, message } = req.body;
  try {
    const newContact = new Contact({ fullName, email, queryRelated, message });
    await newContact.save();
    res.status(201).json({ message: "Contact information saved successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error saving contact information", error });
  }
};

const getContact = async (req, res) => {
  const contacts = await Contact.find().sort({ createdAt: -1 });
  res.json(contacts);
};

module.exports = {
  contactPage,
  getContact,
};
