const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    personalInfo: {
      age: { type: Number, required: true },
      gender: { type: String, required: true }
    },
    waterInfo: {
      source: { type: String, required: true },
      boil: { type: Boolean, required: true },
      filter: { type: Boolean, required: true }
    },
    symptoms: [{ type: String, required: true }],
    result: {
      diseaseName: { type: String, required: true },
      matchCount: { type: Number, required: true },
      severity: { type: String, required: true },
      advice: { type: String, required: true }
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Report", reportSchema);
