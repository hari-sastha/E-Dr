const WaterPollution = require("../models/WaterPollution");
const HealthReport = require("../models/HealthReport");

const pollutionOverview = async (req, res, next) => {
  try {
    const latestByState = await WaterPollution.aggregate([
      { $sort: { date: -1 } },
      {
        $group: {
          _id: "$state",
          pollution_level: { $first: "$pollution_level" },
          date: { $first: "$date" }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.json({ states: latestByState });
  } catch (error) {
    next(error);
  }
};

const dashboardSummary = async (req, res, next) => {
  try {
    const latestReport = await HealthReport.findOne({ user_id: req.user._id }).sort({ date: -1 });
    const pollutionState = req.user.state;

    const latestPollution = pollutionState
      ? await WaterPollution.findOne({ state: pollutionState }).sort({ date: -1 })
      : null;

    const history = await HealthReport.find({ user_id: req.user._id })
      .sort({ date: -1 })
      .limit(10);

    const alerts = [];
    if (latestReport?.risk_level === "HIGH RISK") {
      alerts.push("Your latest health check indicates HIGH RISK. Please consult a doctor immediately.");
    }

    if (latestPollution?.pollution_level === "Danger") {
      alerts.push(`Water pollution is at DANGER level in ${pollutionState}. Avoid unsafe water sources.`);
    }

    res.json({
      latestRiskStatus: latestReport?.risk_level || "No reports yet",
      waterPollutionStatus: latestPollution
        ? {
            state: latestPollution.state,
            pollution_level: latestPollution.pollution_level,
            date: latestPollution.date
          }
        : null,
      alerts,
      history
    });
  } catch (error) {
    next(error);
  }
};

const riskTrends = async (req, res, next) => {
  try {
    const trends = await HealthReport.aggregate([
      {
        $group: {
          _id: "$risk_level",
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);

    res.json({ trends });
  } catch (error) {
    next(error);
  }
};

module.exports = { pollutionOverview, dashboardSummary, riskTrends };
