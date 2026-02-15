const { body, validationResult } = require("express-validator");

const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  return next();
};

const authValidators = [body("idToken").isString().notEmpty()];

const healthCheckValidators = [
  body("personalInfo.age").isInt({ min: 1, max: 120 }),
  body("personalInfo.gender").isString().notEmpty(),
  body("waterInfo.source").isString().notEmpty(),
  body("waterInfo.boil").isBoolean(),
  body("waterInfo.filter").isBoolean(),
  body("symptoms").isArray({ min: 0 })
];

const diseaseValidators = [
  body("name").isString().notEmpty(),
  body("symptoms").isArray({ min: 1 }),
  body("severity").isIn(["low", "medium", "high"]),
  body("advice").isString().notEmpty()
];

module.exports = {
  handleValidation,
  authValidators,
  healthCheckValidators,
  diseaseValidators
};
