const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    firebaseUid: { type: String, required: true, unique: true },
    name: { type: String, trim: true },
    email: { type: String, trim: true, lowercase: true },
    phone: { type: String, trim: true },
    photo: { type: String, trim: true },
    age: { type: Number, min: 1, max: 120 },
    gender: { type: String, enum: ["Male", "Female", "Other"] },
    bloodGroup: { type: String, trim: true },
    state: { type: String, trim: true },
    district: { type: String, trim: true },
    profileCompleted: { type: Boolean, default: false },
    role: { type: String, enum: ["user", "admin"], default: "user" }
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
