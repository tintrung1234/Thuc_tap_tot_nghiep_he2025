const express = require("express");
const router = express.Router();

const { contactPage, getContact } = require("../controllers/contactController");

router.post("/", contactPage);

router.get("/", getContact);

module.exports = router;
