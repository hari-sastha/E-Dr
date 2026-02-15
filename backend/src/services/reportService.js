const Report = require("../models/Report");

const createReport = async ({ userId, personalInfo, waterInfo, symptoms, result }) => {
  const report = await Report.create({
    user: userId,
    personalInfo,
    waterInfo,
    symptoms,
    result
  });

  return report;
};

const getReportsByUser = async (userId) =>
  Report.find({ user: userId }).sort({ createdAt: -1 });

const getReportById = async (reportId, userId) =>
  Report.findOne({ _id: reportId, user: userId });

module.exports = { createReport, getReportsByUser, getReportById };
