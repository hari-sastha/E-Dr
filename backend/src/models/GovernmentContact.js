const mongoose = require("mongoose");

const governmentContactSchema = new mongoose.Schema(
  {
    state: { type: String, required: true, unique: true, trim: true },
    official_email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("GovernmentContact", governmentContactSchema);
