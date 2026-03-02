const mongoose = require("mongoose");

const hospitalSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    distance_km: { type: Number, required: true },
    phone: { type: String, default: "Not Available" },
    lat: { type: Number, required: true },
    lon: { type: Number, required: true }
  },
  { _id: false }
);

const healthReportSchema = new mongoose.Schema(
  {
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    symptoms: [{ type: String, required: true }],
    risk_level: {
      type: String,
      enum: ["LOW RISK", "MEDIUM RISK", "HIGH RISK"],
      required: true
    },
    state: { type: String, trim: true },
    latitude: { type: Number },
    longitude: { type: Number },
    nearest_hospitals: [hospitalSchema],
    date: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

healthReportSchema.index({ user_id: 1, date: -1 });

module.exports = mongoose.model("HealthReport", healthReportSchema);
