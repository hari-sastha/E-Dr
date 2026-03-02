const mongoose = require('mongoose');

const waterPollutionSchema = new mongoose.Schema({
    state: { type: String, required: true },
    pollutionLevel: {
        type: String,
        enum: ['Safe', 'Moderate', 'High', 'Danger'],
        required: true
    },
    date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('WaterPollution', waterPollutionSchema);
