const express = require("express");
const router = express.Router();
const contactController = require("../controllers/contactController");
const authMiddleware = require("../middlewares/authMiddleware");

router.post("/", authMiddleware, contactController.createContact);
router.get("/", authMiddleware, contactController.getAllContacts);
router.get("/:id", authMiddleware, contactController.getContactById);
router.put("/:id", authMiddleware, contactController.updateContactStatus);
router.delete("/:id", authMiddleware, contactController.deleteContact);
router.get("/user/:uid", authMiddleware, contactController.getContactsByUser);

module.exports = router;
