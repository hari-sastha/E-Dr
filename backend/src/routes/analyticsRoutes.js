const express = require("express");
const { diseaseTrends } = require("../controllers/analyticsController");
const { requireAuth, requireAdmin } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/trends", requireAuth, requireAdmin, diseaseTrends);

module.exports = router;
