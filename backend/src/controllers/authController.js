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
    const decoded = await admin.auth().verifyIdToken(idToken);

    const { uid, name, email, phone_number: phone, picture } = decoded;
    const existingUser = await User.findOne({ firebaseUid: uid });

    const user = await User.findOneAndUpdate(
      { firebaseUid: uid },
      {
        $set: {
          name: name || existingUser?.name || "",
          email: email || existingUser?.email || "",
          phone: phone || existingUser?.phone || "",
          photo: picture || existingUser?.photo || ""
        },
        $setOnInsert: {
          firebaseUid: uid,
          profileCompleted: false
        }
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    ).select("-__v");

    const token = createJwt(user._id);

    res.json({
      token,
      user,
      isNewUser: !existingUser,
      needsProfileCompletion: !user.profileCompleted
    });
  } catch (error) {
    next(error);
  }
};

const completeProfile = async (req, res, next) => {
  try {
    const { name, age, gender, bloodGroup, phone, state, district } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        name,
        age,
        gender,
        bloodGroup,
        phone,
        state,
        district,
        profileCompleted: true
      },
      { new: true }
    ).select("-__v");

    res.json({ user });
  } catch (error) {
    next(error);
  }
};

const getMe = async (req, res) => {
  res.json({ user: req.user });
};

module.exports = { firebaseLogin, getMe, completeProfile };
