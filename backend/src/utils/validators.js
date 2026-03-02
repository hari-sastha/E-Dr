const { body, validationResult } = require("express-validator");

const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  return next();
};

const authValidators = [body("idToken").isString().notEmpty()];

const biodataValidators = [
  body("name").isString().notEmpty(),
  body("age").isInt({ min: 1, max: 120 }),
  body("gender").isIn(["Male", "Female", "Other"]),
  body("bloodGroup").isString().notEmpty(),
  body("phone").isString().notEmpty(),
  body("state").isString().notEmpty(),
  body("district").isString().notEmpty()
];

const healthCheckValidators = [
  body("symptoms").isArray({ min: 0 }),
  body("latitude").optional().isFloat({ min: -90, max: 90 }),
  body("longitude").optional().isFloat({ min: -180, max: 180 })
];

const waterPollutionValidators = [
  body("state").isString().notEmpty(),
  body("pollution_level").isIn(["Safe", "Moderate", "High", "Danger"]),
  body("date").optional().isISO8601()
];

const governmentContactValidators = [
  body("state").isString().notEmpty(),
  body("official_email").isEmail()
];

module.exports = {
  handleValidation,
  authValidators,
  biodataValidators,
  healthCheckValidators,
  waterPollutionValidators,
  governmentContactValidators
};
