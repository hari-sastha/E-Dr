const Disease = require("../models/Disease");

const listDiseases = async (req, res, next) => {
  try {
    const diseases = await Disease.find().sort({ name: 1 });
    res.json({ diseases });
  } catch (error) {
    next(error);
  }
};

const createDisease = async (req, res, next) => {
  try {
    const disease = await Disease.create(req.body);
    res.status(201).json({ disease });
  } catch (error) {
    next(error);
  }
};

const updateDisease = async (req, res, next) => {
  try {
    const disease = await Disease.findByIdAndUpdate(req.params.id, req.body, {
      new: true
    });

    if (!disease) {
      return res.status(404).json({ message: "Disease not found" });
    }

    res.json({ disease });
  } catch (error) {
    next(error);
  }
};

const deleteDisease = async (req, res, next) => {
  try {
    const disease = await Disease.findByIdAndDelete(req.params.id);
    if (!disease) {
      return res.status(404).json({ message: "Disease not found" });
    }
    res.json({ message: "Disease removed" });
  } catch (error) {
    next(error);
  }
};

module.exports = { listDiseases, createDisease, updateDisease, deleteDisease };
