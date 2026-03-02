const express = require("express");
const {
	pollutionOverview,
	dashboardSummary,
	riskTrends
} = require("../controllers/analyticsController");
const { requireAuth } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/dashboard", requireAuth, dashboardSummary);
router.get("/pollution-overview", requireAuth, pollutionOverview);
router.get("/risk-trends", requireAuth, riskTrends);

module.exports = router;
