const SearchService = require("../services/SearchService");

class SearchController {
  async search(req, res) {
    console.log(req)
    const { query } = req.body;
    if (!query) {
      return res.status(400).json({ error: "Query is required" });
    }

    try {
      const result = await SearchService.search(query);
      res.json(result);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Search failed" });
    }
  }
}

module.exports = new SearchController();
