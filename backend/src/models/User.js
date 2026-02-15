const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    firebaseUid: { type: String, required: true, unique: true },
    name: { type: String, trim: true },
    email: { type: String, trim: true, lowercase: true },
    phone: { type: String, trim: true },
    photo: { type: String, trim: true },
    role: { type: String, enum: ["user", "admin"], default: "user" }
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
