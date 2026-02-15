const express = require("express");
const { listReports, fetchReport } = require("../controllers/reportController");
const { requireAuth } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", requireAuth, listReports);
router.get("/:id", requireAuth, fetchReport);

module.exports = router;
