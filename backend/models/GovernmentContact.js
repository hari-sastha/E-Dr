const mongoose = require('mongoose');

const governmentContactSchema = new mongoose.Schema({
    state: { type: String, required: true, unique: true },
    officialEmail: { type: String, required: true }
});

module.exports = mongoose.model('GovernmentContact', governmentContactSchema);
