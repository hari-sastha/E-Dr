const WaterPollution = require("../models/WaterPollution");

const normalizeStateKey = (value = "") =>
  value.toLowerCase().replace(/[\s_-]/g, "");

// Classification logic for water edibility
const classifyWaterQuality = (waterQualityIndex, phLevel, contaminationLevel) => {
  let edibility, status, alertMessage;

  // EDIBLE - Safe to drink
  if (waterQualityIndex >= 70 && phLevel >= 6.5 && phLevel <= 8.5 && contaminationLevel === "Low") {
    edibility = "EDIBLE";
    status = "SAFE";
    alertMessage = "✅ Water is safe for drinking";
  }
  // MODERATE - Boil before drinking
  else if (waterQualityIndex >= 40 && waterQualityIndex < 70) {
    edibility = "MODERATE";
    status = "BOIL BEFORE DRINKING";
    alertMessage = "⚠️ Boil water before drinking";
  }
  // NON EDIBLE - Unsafe
  else if (waterQualityIndex < 40 || contaminationLevel === "High") {
    edibility = "NON EDIBLE";
    status = "UNSAFE";
    alertMessage = "🚨 Water is unsafe for drinking. Use bottled or treated water.";
  }
  // Default to MODERATE if doesn't fit above criteria
  else {
    edibility = "MODERATE";
    status = "BOIL BEFORE DRINKING";
    alertMessage = "⚠️ Boil water before drinking";
  }

  return { edibility, status, alertMessage };
};

// Create or update water pollution data
const createOrUpdateWaterPollution = async (waterData) => {
  try {
    const { water_quality_index, ph_level, contamination_level } = waterData;

    // Classify water quality
    const { edibility, status, alertMessage } = classifyWaterQuality(
      water_quality_index,
      ph_level,
      contamination_level
    );

    // Determine pollution level based on water quality index
    let pollution_level;
    if (water_quality_index >= 70) pollution_level = "Safe";
    else if (water_quality_index >= 50) pollution_level = "Moderate";
    else if (water_quality_index >= 30) pollution_level = "High";
    else pollution_level = "Danger";

    const enrichedData = {
      ...waterData,
      edibility,
      status,
      alert_message: alertMessage,
      pollution_level
    };

    // Check if data exists for this state on this date
    const existingRecord = await WaterPollution.findOne({
      state: waterData.state,
      date: {
        $gte: new Date(waterData.date).setHours(0, 0, 0, 0),
        $lt: new Date(waterData.date).setHours(23, 59, 59, 999)
      }
    });

    if (existingRecord) {
      const updated = await WaterPollution.findByIdAndUpdate(
        existingRecord._id,
        enrichedData,
        { new: true }
      );
      return updated;
    } else {
      const newRecord = new WaterPollution(enrichedData);
      return await newRecord.save();
    }
  } catch (error) {
    throw new Error(`Failed to create/update water pollution data: ${error.message}`);
  }
};

// Get latest water pollution data for all states
const getAllStatesWaterPollution = async () => {
  try {
    const pipeline = [
      {
        $sort: { state: 1, date: -1 }
      },
      {
        $group: {
          _id: "$state",
          latestData: { $first: "$$ROOT" }
        }
      },
      {
        $replaceRoot: { newRoot: "$latestData" }
      },
      {
        $sort: { state: 1 }
      }
    ];

    const states = await WaterPollution.aggregate(pipeline);
    return states;
  } catch (error) {
    throw new Error(`Failed to fetch water pollution data: ${error.message}`);
  }
};

// Get water pollution data for specific state
const getStateWaterPollution = async (state) => {
  try {
    const decodedState = decodeURIComponent(state || "");

    const exactOrCaseInsensitive = await WaterPollution.findOne({
      state: { $regex: `^${decodedState}$`, $options: "i" }
    })
      .sort({ date: -1 })
      .lean();

    if (exactOrCaseInsensitive) {
      return exactOrCaseInsensitive;
    }

    const allStatesLatest = await getAllStatesWaterPollution();
    const normalizedMatch = allStatesLatest.find(
      (item) => normalizeStateKey(item.state) === normalizeStateKey(decodedState)
    );

    return normalizedMatch || null;
  } catch (error) {
    throw new Error(`Failed to fetch water data for ${state}: ${error.message}`);
  }
};

// Get water pollution history for a state
const getStateWaterHistory = async (state, limit = 10) => {
  try {
    const history = await WaterPollution.find({ state })
      .sort({ date: -1 })
      .limit(limit)
      .lean();
    return history;
  } catch (error) {
    throw new Error(`Failed to fetch water history: ${error.message}`);
  }
};

// Bulk import water pollution data from CSV/JSON
const bulkImportWaterData = async (dataArray) => {
  try {
    const results = [];
    for (const record of dataArray) {
      const result = await createOrUpdateWaterPollution(record);
      results.push(result);
    }
    return results;
  } catch (error) {
    throw new Error(`Bulk import failed: ${error.message}`);
  }
};

// Get risk assessment based on state water quality
const getStateWaterRiskAssessment = async (state) => {
  try {
    const waterData = await getStateWaterPollution(state);
    if (!waterData) {
      return { riskLevel: "UNKNOWN", message: "No water quality data available" };
    }

    return {
      state: waterData.state,
      waterQualityIndex: waterData.water_quality_index,
      edibility: waterData.edibility,
      status: waterData.status,
      alertMessage: waterData.alert_message,
      riskLevel: waterData.edibility === "EDIBLE" ? "LOW" : waterData.edibility === "MODERATE" ? "MEDIUM" : "HIGH",
      diseaseRiskIncrease: waterData.edibility === "NON EDIBLE" ? 30 : waterData.edibility === "MODERATE" ? 15 : 0
    };
  } catch (error) {
    throw new Error(`Failed to get water risk assessment: ${error.message}`);
  }
};

// Delete water pollution record
const deleteWaterPollutionRecord = async (id) => {
  try {
    const deleted = await WaterPollution.findByIdAndDelete(id);
    return deleted;
  } catch (error) {
    throw new Error(`Failed to delete record: ${error.message}`);
  }
};

module.exports = {
  classifyWaterQuality,
  createOrUpdateWaterPollution,
  getAllStatesWaterPollution,
  getStateWaterPollution,
  getStateWaterHistory,
  bulkImportWaterData,
  getStateWaterRiskAssessment,
  deleteWaterPollutionRecord
};
