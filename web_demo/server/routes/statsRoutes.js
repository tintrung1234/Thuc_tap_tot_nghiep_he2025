// routes/stats.routes.js
const express = require("express");
const router = express.Router();
const statsController = require("../controllers/statsController");

router.get("/", statsController.getStatistics);

module.exports = router;
