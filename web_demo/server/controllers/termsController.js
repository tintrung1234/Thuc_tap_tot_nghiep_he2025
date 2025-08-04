const Terms = require("../models/Terms");

// New endpoint for terms and conditions
const getTerms = async (req, res) => {
  try {
    const terms = await Terms.find().sort({ createdAt: -1 });
    const latestUpdate = terms.length > 0 ? terms[0].createdAt : new Date();
    res.json({ terms, latestUpdate });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching terms and conditions", error });
  }
};

module.exports = {
  getTerms,
};
