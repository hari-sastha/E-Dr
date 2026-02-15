const Report = require("../models/Report");

const getDiseaseTrends = async () =>
  Report.aggregate([
    {
      $group: {
        _id: "$result.diseaseName",
        count: { $sum: 1 }
      }
    },
    { $sort: { count: -1 } }
  ]);

module.exports = { getDiseaseTrends };
