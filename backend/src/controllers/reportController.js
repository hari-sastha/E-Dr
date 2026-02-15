const { getReportsByUser, getReportById } = require("../services/reportService");

const listReports = async (req, res, next) => {
  try {
    const reports = await getReportsByUser(req.user._id);
    res.json({ reports });
  } catch (error) {
    next(error);
  }
};

const fetchReport = async (req, res, next) => {
  try {
    const report = await getReportById(req.params.id, req.user._id);
    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }
    res.json({ report });
  } catch (error) {
    next(error);
  }
};

module.exports = { listReports, fetchReport };
