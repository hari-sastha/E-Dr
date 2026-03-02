const HealthReport = require("../models/HealthReport");

const createReport = async ({
  userId,
  symptoms,
  riskLevel,
  state,
  latitude,
  longitude,
  nearestHospitals
}) =>
  HealthReport.create({
    user_id: userId,
    symptoms,
    risk_level: riskLevel,
    state,
    latitude,
    longitude,
    nearest_hospitals: nearestHospitals,
    date: new Date()
  });

const getReportsByUser = async (userId) =>
  HealthReport.find({ user_id: userId }).sort({ date: -1 });

const getReportById = async (reportId, userId) =>
  HealthReport.findOne({ _id: reportId, user_id: userId });

const getRiskDistribution = async () =>
  HealthReport.aggregate([
    { $group: { _id: "$risk_level", count: { $sum: 1 } } },
    { $sort: { count: -1 } }
  ]);

module.exports = {
  createReport,
  getReportsByUser,
  getReportById,
  getRiskDistribution
};
