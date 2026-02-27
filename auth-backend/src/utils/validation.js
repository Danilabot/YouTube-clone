const validateRegistration = (data) => {
  const errors = {};

  if (!data.name || data.name.trim().length < 2) {
    errors.name = 'Name must be at least 2 characters';
  }

  if (!data.email || !/^\S+@\S+\.\S+$/.test(data.email)) {
    errors.email = 'Please enter a valid email';
  }

  if (!data.password || data.password.length < 6) {
    errors.password = 'Password must be at least 6 characters';
  }

  if (data.password !== data.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match';
  }

  return {
    errors,
    isValid: Object.keys(errors).length === 0
  };
};

const validateLogin = (data) => {
  const errors = {};

  if (!data.email || !/^\S+@\S+\.\S+$/.test(data.email)) {
    errors.email = 'Please enter a valid email';
  }

  if (!data.password) {
    errors.password = 'Password is required';
  }

  return {
    errors,
    isValid: Object.keys(errors).length === 0
  };
};

module.exports = { validateRegistration, validateLogin };