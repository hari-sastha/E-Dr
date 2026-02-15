const express = require("express");
const {
  listDiseases,
  createDisease,
  updateDisease,
  deleteDisease
} = require("../controllers/adminController");
const { requireAuth, requireAdmin } = require("../middleware/authMiddleware");
const { diseaseValidators, handleValidation } = require("../utils/validators");

const router = express.Router();

router.get("/diseases", requireAuth, requireAdmin, listDiseases);
router.post("/diseases", requireAuth, requireAdmin, diseaseValidators, handleValidation, createDisease);
router.put("/diseases/:id", requireAuth, requireAdmin, diseaseValidators, handleValidation, updateDisease);
router.delete("/diseases/:id", requireAuth, requireAdmin, deleteDisease);

module.exports = router;
