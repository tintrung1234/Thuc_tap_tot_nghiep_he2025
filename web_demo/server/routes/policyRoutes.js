const express = require("express");
const router = express.Router();

const { getPolicy } = require("../controllers/policyController");

router.get("/", getPolicy);

module.exports = router;
