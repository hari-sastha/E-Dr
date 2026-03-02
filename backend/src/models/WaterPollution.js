const mongoose = require("mongoose");

const waterPollutionSchema = new mongoose.Schema(
  {
    state: { type: String, required: true, trim: true, index: true },
    water_quality_index: { type: Number, required: true, min: 0, max: 100 },
    ph_level: { type: Number, required: true, min: 0, max: 14 },
    contamination_level: {
      type: String,
      enum: ["Low", "Moderate", "High"],
      default: "Moderate"
    },
    pollution_level: {
      type: String,
      enum: ["Safe", "Moderate", "High", "Danger"],
      required: true
    },
    edibility: {
      type: String,
      enum: ["EDIBLE", "MODERATE", "NON EDIBLE"],
      required: true
    },
    status: {
      type: String,
      enum: ["SAFE", "BOIL BEFORE DRINKING", "UNSAFE"],
      required: true
    },
    alert_message: String,
    date: { type: Date, default: Date.now },
    source: { type: String, default: "Manual Entry" },
    testing_agency: String,
    dissolved_oxygen: Number,
    turbidity: Number,
    total_hardness: Number,
    chlorine_residual: Number,
    notes: String
  },
  { timestamps: true }
);

waterPollutionSchema.index({ state: 1, date: -1 });
waterPollutionSchema.index({ state: 1, createdAt: -1 });

module.exports = mongoose.model("WaterPollution", waterPollutionSchema);
