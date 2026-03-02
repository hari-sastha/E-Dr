const mongoose = require('mongoose');

const healthReportSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    symptoms: [{ type: String, required: true }],
    riskLevel: {
        type: String,
        enum: ['LOW', 'MEDIUM', 'HIGH'],
        required: true
    },
    date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('HealthReport', healthReportSchema);
