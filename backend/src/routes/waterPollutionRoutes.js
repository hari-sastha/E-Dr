const express = require("express");
const {
  getAllWaterPollution,
  getWaterPollutionByState,
  getWaterPollutionHistory,
  getWaterRiskAssessment,
  addWaterPollution,
  importWaterPollutionData,
  deleteWaterPollution
} = require("../controllers/waterPollutionController");
const { requireAuth, requireAdmin } = require("../middleware/authMiddleware");

const router = express.Router();

// Public routes
router.get("/", getAllWaterPollution);
router.get("/state/:state", getWaterPollutionByState);
router.get("/history/:state", getWaterPollutionHistory);
router.get("/assessment/state", getWaterRiskAssessment);

// Admin routes
router.post("/add", requireAuth, requireAdmin, addWaterPollution);
router.post("/import", requireAuth, requireAdmin, importWaterPollutionData);
router.delete("/:id", requireAuth, requireAdmin, deleteWaterPollution);

module.exports = router;
