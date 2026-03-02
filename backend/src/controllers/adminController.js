const User = require("../models/User");
const HealthReport = require("../models/HealthReport");
const WaterPollution = require("../models/WaterPollution");
const GovernmentContact = require("../models/GovernmentContact");
const { notifyGovernmentOnDanger } = require("../services/alertService");

const addWaterPollution = async (req, res, next) => {
  try {
    const { state, pollution_level, date } = req.body;
    const entry = await WaterPollution.create({
      state,
      pollution_level,
      date: date || new Date()
    });

    await notifyGovernmentOnDanger({
      state: entry.state,
      pollutionLevel: entry.pollution_level,
      date: entry.date
    });

    res.status(201).json({ pollution: entry });
  } catch (error) {
    next(error);
  }
};

const listWaterPollution = async (req, res, next) => {
  try {
    const pollution = await WaterPollution.find().sort({ date: -1 }).limit(200);
    res.json({ pollution });
  } catch (error) {
    next(error);
  }
};

const addGovernmentContact = async (req, res, next) => {
  try {
    const { state, official_email } = req.body;
    const contact = await GovernmentContact.findOneAndUpdate(
      { state },
      { state, official_email },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    res.status(201).json({ contact });
  } catch (error) {
    next(error);
  }
};

const listGovernmentContacts = async (req, res, next) => {
  try {
    const contacts = await GovernmentContact.find().sort({ state: 1 });
    res.json({ contacts });
  } catch (error) {
    next(error);
  }
};

const listUsers = async (req, res, next) => {
  try {
    const users = await User.find().select("-__v").sort({ createdAt: -1 }).limit(500);
    res.json({ users });
  } catch (error) {
    next(error);
  }
};

const listAllReports = async (req, res, next) => {
  try {
    const reports = await HealthReport.find()
      .populate("user_id", "name email state district")
      .sort({ date: -1 })
      .limit(500);
    res.json({ reports });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addWaterPollution,
  listWaterPollution,
  addGovernmentContact,
  listGovernmentContacts,
  listUsers,
  listAllReports
};
