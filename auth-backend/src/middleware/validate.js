const { validateRegistration, validateLogin } = require('../utils/validation');

const validateRegisterInput = (req, res, next) => {
  const { errors, isValid } = validateRegistration(req.body);

  if (!isValid) {
    return res.status(400).json({ errors });
  }

  next();
};

const validateLoginInput = (req, res, next) => {
  const { errors, isValid } = validateLogin(req.body);

  if (!isValid) {
    return res.status(400).json({ errors });
  }

  next();
};

module.exports = { validateRegisterInput, validateLoginInput };