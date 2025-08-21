const express = require("express");
const SearchController = require("../controllers/searchController");

const router = express.Router();

router.post("/", SearchController.search);

module.exports = router;
