const express = require("express");
const {
	firebaseLogin,
	getMe,
	completeProfile
} = require("../controllers/authController");
const { requireAuth } = require("../middleware/authMiddleware");
const {
	authValidators,
	handleValidation,
	biodataValidators
} = require("../utils/validators");

const router = express.Router();

router.post("/firebase", authValidators, handleValidation, firebaseLogin);
router.get("/me", requireAuth, getMe);
router.put("/profile", requireAuth, biodataValidators, handleValidation, completeProfile);

module.exports = router;
