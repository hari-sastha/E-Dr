const express = require("express");
const { assessHealth } = require("../controllers/healthController");
const { requireAuth } = require("../middleware/authMiddleware");
const { healthCheckValidators, handleValidation } = require("../utils/validators");

const router = express.Router();

router.post("/assess", requireAuth, healthCheckValidators, handleValidation, assessHealth);

module.exports = router;
