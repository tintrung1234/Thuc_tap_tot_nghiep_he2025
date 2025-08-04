const Policy = require("../models/Policy");

// New endpoint for terms and conditions
const getPolicy = async (req, res) => {
  try {
    const policy = await Policy.find().sort({ createdAt: -1 });
    const latestUpdate = policy.length > 0 ? policy[0].createdAt : new Date();
    res.json({ policy, latestUpdate });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching terms and conditions", error });
  }
};

module.exports = {
  getPolicy,
};
