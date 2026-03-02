const express = require("express");
const {
  addWaterPollution,
  listWaterPollution,
  addGovernmentContact,
  listGovernmentContacts,
  listUsers,
  listAllReports
} = require("../controllers/adminController");
const { requireAuth, requireAdmin } = require("../middleware/authMiddleware");
const {
  waterPollutionValidators,
  governmentContactValidators,
  handleValidation
} = require("../utils/validators");

const router = express.Router();

router.get("/water-pollution", requireAuth, requireAdmin, listWaterPollution);
router.post(
  "/water-pollution",
  requireAuth,
  requireAdmin,
  waterPollutionValidators,
  handleValidation,
  addWaterPollution
);
router.get("/government-contacts", requireAuth, requireAdmin, listGovernmentContacts);
router.post(
  "/government-contacts",
  requireAuth,
  requireAdmin,
  governmentContactValidators,
  handleValidation,
  addGovernmentContact
);
router.get("/users", requireAuth, requireAdmin, listUsers);
router.get("/reports", requireAuth, requireAdmin, listAllReports);

module.exports = router;
