const mongoose = require("mongoose");
const WaterPollution = require("../src/models/WaterPollution");
require("dotenv").config();

// Classification function
const classifyWaterQuality = (wqi, ph, contaminationLevel) => {
  let edibility, status, alertMessage;

  if (wqi >= 70 && ph >= 6.5 && ph <= 8.5 && contaminationLevel === "Low") {
    edibility = "EDIBLE";
    status = "SAFE";
    alertMessage = "✅ Water is safe for drinking";
  } else if (wqi >= 40 && wqi < 70) {
    edibility = "MODERATE";
    status = "BOIL BEFORE DRINKING";
    alertMessage = "⚠️ Boil water before drinking";
  } else if (wqi < 40 || contaminationLevel === "High") {
    edibility = "NON EDIBLE";
    status = "UNSAFE";
    alertMessage = "🚨 Water is unsafe for drinking. Use bottled or treated water.";
  } else {
    edibility = "MODERATE";
    status = "BOIL BEFORE DRINKING";
    alertMessage = "⚠️ Boil water before drinking";
  }

  return { edibility, status, alertMessage };
};

const getPollutionLevel = (wqi) => {
  if (wqi >= 70) return "Safe";
  if (wqi >= 50) return "Moderate";
  if (wqi >= 30) return "High";
  return "Danger";
};

// Base seed data
const baseSeedData = [
  {
    state: "Maharashtra",
    water_quality_index: 78,
    ph_level: 7.1,
    contamination_level: "Low",
    dissolved_oxygen: 7.8,
    turbidity: 2.1,
    total_hardness: 145,
    chlorine_residual: 0.4,
    source: "Municipal Water Treatment Plant",
    testing_agency: "Maharashtra Water Authority",
    notes: "Water quality monitoring completed on schedule"
  },
  {
    state: "Karnataka",
    water_quality_index: 72,
    ph_level: 7.0,
    contamination_level: "Low",
    dissolved_oxygen: 7.5,
    turbidity: 2.5,
    total_hardness: 155,
    chlorine_residual: 0.35,
    source: "Municipal Water Treatment Plant",
    testing_agency: "Karnataka Water Authority",
    notes: "Routine testing completed"
  },
  {
    state: "Tamil Nadu",
    water_quality_index: 55,
    ph_level: 7.3,
    contamination_level: "Moderate",
    dissolved_oxygen: 6.2,
    turbidity: 4.5,
    total_hardness: 210,
    chlorine_residual: 0.25,
    source: "Municipal Water Treatment Plant",
    testing_agency: "Tamil Nadu Water Authority",
    notes: "Water quality below standard - treatment recommended"
  },
  {
    state: "West Bengal",
    water_quality_index: 38,
    ph_level: 6.8,
    contamination_level: "High",
    dissolved_oxygen: 4.2,
    turbidity: 7.8,
    total_hardness: 285,
    chlorine_residual: 0.1,
    source: "Municipal Water Treatment Plant",
    testing_agency: "West Bengal Water Authority",
    notes: "High contamination detected - water unsafe for drinking"
  },
  {
    state: "Delhi",
    water_quality_index: 68,
    ph_level: 7.4,
    contamination_level: "Low",
    dissolved_oxygen: 7.3,
    turbidity: 3.2,
    total_hardness: 175,
    chlorine_residual: 0.45,
    source: "Delhi Jal Board Water Treatment",
    testing_agency: "Delhi Water Authority",
    notes: "Water quality within acceptable limits"
  },
  {
    state: "Uttar Pradesh",
    water_quality_index: 45,
    ph_level: 7.5,
    contamination_level: "Moderate",
    dissolved_oxygen: 5.8,
    turbidity: 5.2,
    total_hardness: 235,
    chlorine_residual: 0.2,
    source: "Municipal Water Treatment Plant",
    testing_agency: "Uttar Pradesh Water Authority",
    notes: "Water quality below optimal - recommendations issued"
  },
  {
    state: "Gujarat",
    water_quality_index: 74,
    ph_level: 7.2,
    contamination_level: "Low",
    dissolved_oxygen: 7.6,
    turbidity: 2.3,
    total_hardness: 165,
    chlorine_residual: 0.36,
    source: "Municipal Water Treatment Plant",
    testing_agency: "Gujarat Water Authority",
    notes: "Good water quality - meets standards"
  },
  {
    state: "Rajasthan",
    water_quality_index: 52,
    ph_level: 8.1,
    contamination_level: "Moderate",
    dissolved_oxygen: 6.0,
    turbidity: 4.8,
    total_hardness: 250,
    chlorine_residual: 0.22,
    source: "Municipal Water Treatment Plant",
    testing_agency: "Rajasthan Water Authority",
    notes: "pH slightly elevated - treatment ongoing"
  },
  {
    state: "Telangana",
    water_quality_index: 71,
    ph_level: 6.9,
    contamination_level: "Low",
    dissolved_oxygen: 7.4,
    turbidity: 2.8,
    total_hardness: 180,
    chlorine_residual: 0.38,
    source: "HMWSSB Water Treatment Plant",
    testing_agency: "Telangana Water Authority",
    notes: "Water quality satisfactory"
  },
  {
    state: "Punjab",
    water_quality_index: 64,
    ph_level: 7.2,
    contamination_level: "Moderate",
    dissolved_oxygen: 6.5,
    turbidity: 3.9,
    total_hardness: 195,
    chlorine_residual: 0.28,
    source: "Municipal Water Treatment Plant",
    testing_agency: "Punjab Water Authority",
    notes: "Contaminants detected - boiling recommended"
  }
];

// Enrich seed data with calculated values
const seedData = baseSeedData.map(record => {
  const { edibility, status, alertMessage } = classifyWaterQuality(
    record.water_quality_index,
    record.ph_level,
    record.contamination_level
  );

  return {
    ...record,
    pollution_level: getPollutionLevel(record.water_quality_index),
    edibility,
    status,
    alert_message: alertMessage
  };
});

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || "mongodb+srv://harisastha:Haris2005@e-dr.xqujc.mongodb.net/edr-backend?retryWrites=true&w=majority", {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    console.log("✅ Connected to MongoDB");

    // Clear existing water pollution records
    await WaterPollution.deleteMany({});
    console.log("🗑️  Cleared existing water pollution data");

    // Insert seed data
    const result = await WaterPollution.insertMany(seedData);
    console.log(`✅ Seeded ${result.length} water pollution records for Indian states`);

    // Display summary
    console.log("\n📊 Water Pollution Data Summary:");
    console.log("================================");
    const states = await WaterPollution.find({}).select("state water_quality_index pollution_level -_id");
    states.forEach(record => {
      console.log(`${record.state}: WQI=${record.water_quality_index} | Status=${record.pollution_level}`);
    });

    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
}

seedDatabase();
