const { getTopMatch } = require("../services/diseaseService");
const { createReport } = require("../services/reportService");

const assessHealth = async (req, res, next) => {
  try {
    const { personalInfo, waterInfo, symptoms } = req.body;
    const result = await getTopMatch(symptoms || []);

    const report = await createReport({
      userId: req.user._id,
      personalInfo,
      waterInfo,
      symptoms,
      result
    });

    res.json({ result, reportId: report._id });
  } catch (error) {
    next(error);
  }
};

module.exports = { assessHealth };
