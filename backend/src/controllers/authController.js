const jwt = require("jsonwebtoken");
const admin = require("../config/firebaseAdmin");
const User = require("../models/User");

const createJwt = (userId) =>
  jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d"
  });

const firebaseLogin = async (req, res, next) => {
  try {
    const { idToken } = req.body;
    // Verify Firebase ID token and create a short-lived JWT for API sessions.
    const decoded = await admin.auth().verifyIdToken(idToken);

    const { uid, name, email, phone_number: phone, picture } = decoded;

    const user = await User.findOneAndUpdate(
      { firebaseUid: uid },
      {
        firebaseUid: uid,
        name: name || "",
        email: email || "",
        phone: phone || "",
        photo: picture || ""
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    ).select("-__v");

    const token = createJwt(user._id);

    res.json({ token, user });
  } catch (error) {
    next(error);
  }
};

const getMe = async (req, res) => {
  res.json({ user: req.user });
};

module.exports = { firebaseLogin, getMe };
