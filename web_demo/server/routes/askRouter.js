const express = require("express");
const handleAsk = require("../controllers/askController.js");

const router = express.Router();

router.post("/", handleAsk);

module.exports = router;
