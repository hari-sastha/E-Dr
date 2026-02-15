const mongoose = require("mongoose");

const diseaseSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    symptoms: [{ type: String, required: true, trim: true }],
    severity: {
      type: String,
      enum: ["low", "medium", "high"],
      required: true
    },
    advice: { type: String, required: true, trim: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Disease", diseaseSchema);
