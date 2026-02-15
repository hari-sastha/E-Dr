const { getDiseaseTrends } = require("../services/analyticsService");

const diseaseTrends = async (req, res, next) => {
  try {
    const trends = await getDiseaseTrends();
    res.json({ trends });
  } catch (error) {
    next(error);
  }
};

module.exports = { diseaseTrends };
