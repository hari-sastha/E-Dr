const { createReport } = require("../services/reportService");
const { fetchNearestHospitals } = require("../services/hospitalService");
const { notifyUserOnHighRisk } = require("../services/alertService");

const classifyRisk = (symptomCount) => {
  if (symptomCount >= 5) {
    return "HIGH RISK";
  }

  if (symptomCount >= 3) {
    return "MEDIUM RISK";
  }

  return "LOW RISK";
};

const assessHealth = async (req, res, next) => {
  try {
    const { symptoms = [], latitude, longitude } = req.body;
    const normalizedSymptoms = symptoms.map((item) =>
      String(item || "").trim().toLowerCase()
    );
    const riskLevel = classifyRisk(normalizedSymptoms.length);

    let nearestHospitals = [];
    if (typeof latitude === "number" && typeof longitude === "number") {
      nearestHospitals = await fetchNearestHospitals({ latitude, longitude, limit: 5 });
    }

    const report = await createReport({
      userId: req.user._id,
      symptoms: normalizedSymptoms,
      riskLevel,
      state: req.user.state,
      latitude,
      longitude,
      nearestHospitals
    });

    await notifyUserOnHighRisk({
      email: req.user.email,
      riskLevel,
      hospitals: nearestHospitals
    });

    res.json({
      reportId: report._id,
      riskLevel,
      nearestHospitals
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { assessHealth };
