const {
  createOrUpdateWaterPollution,
  getAllStatesWaterPollution,
  getStateWaterPollution,
  getStateWaterHistory,
  bulkImportWaterData,
  getStateWaterRiskAssessment,
  deleteWaterPollutionRecord
} = require("../services/waterPollutionService");

// Get all states water pollution data
const getAllWaterPollution = async (req, res) => {
  try {
    const data = await getAllStatesWaterPollution();
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get water pollution for specific state
const getWaterPollutionByState = async (req, res) => {
  try {
    const { state } = req.params;
    const data = await getStateWaterPollution(state);
    if (!data) {
      return res.status(404).json({ error: `No data found for state: ${state}` });
    }
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get water pollution history for state
const getWaterPollutionHistory = async (req, res) => {
  try {
    const { state } = req.params;
    const limit = parseInt(req.query.limit) || 10;
    const history = await getStateWaterHistory(state, limit);
    res.json({ success: true, history });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get water risk assessment for user's state
const getWaterRiskAssessment = async (req, res) => {
  try {
    const { state } = req.query;
    if (!state) {
      return res.status(400).json({ error: "State is required" });
    }
    const assessment = await getStateWaterRiskAssessment(state);
    res.json({ success: true, assessment });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Add water pollution data (admin)
const addWaterPollution = async (req, res) => {
  try {
    const waterData = req.body;
    const result = await createOrUpdateWaterPollution(waterData);
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Bulk import water pollution data (admin)
const importWaterPollutionData = async (req, res) => {
  try {
    const { data } = req.body;
    if (!Array.isArray(data)) {
      return res.status(400).json({ error: "Data must be an array" });
    }
    const results = await bulkImportWaterData(data);
    res.json({
      success: true,
      message: `Imported ${results.length} records`,
      data: results
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete water pollution record (admin)
const deleteWaterPollution = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await deleteWaterPollutionRecord(id);
    if (!result) {
      return res.status(404).json({ error: "Record not found" });
    }
    res.json({ success: true, message: "Record deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllWaterPollution,
  getWaterPollutionByState,
  getWaterPollutionHistory,
  getWaterRiskAssessment,
  addWaterPollution,
  importWaterPollutionData,
  deleteWaterPollution
};
