const express = require("express");
const { firebaseLogin, getMe } = require("../controllers/authController");
const { requireAuth } = require("../middleware/authMiddleware");
const { authValidators, handleValidation } = require("../utils/validators");

const router = express.Router();

router.post("/firebase", authValidators, handleValidation, firebaseLogin);
router.get("/me", requireAuth, getMe);

module.exports = router;
