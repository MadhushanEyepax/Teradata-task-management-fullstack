import { VALIDATION_RULES } from "./constants";

export const validateEmail = (email) => {
  if (!email) {
    return "Email is required";
  }
  if (!VALIDATION_RULES.EMAIL_REGEX.test(email)) {
    return "Invalid email format";
  }
  return null;
};

export const validatePassword = (password) => {
  if (!password) {
    return "Password is required";
  }
  if (password.length < VALIDATION_RULES.PASSWORD_MIN_LENGTH) {
    return `Password must be at least ${VALIDATION_RULES.PASSWORD_MIN_LENGTH} characters`;
  }
  return null;
};

export const validateUsername = (username) => {
  if (!username) {
    return "Username is required";
  }
  if (username.length < VALIDATION_RULES.USERNAME_MIN_LENGTH) {
    return `Username must be at least ${VALIDATION_RULES.USERNAME_MIN_LENGTH} characters`;
  }
  return null;
};

export const validateRequired = (value, fieldName = "This field") => {
  if (!value || (typeof value === "string" && !value.trim())) {
    return `${fieldName} is required`;
  }
  return null;
};

export const validateMaxLength = (
  value,
  maxLength,
  fieldName = "This field"
) => {
  if (value && value.length > maxLength) {
    return `${fieldName} must not exceed ${maxLength} characters`;
  }
  return null;
};

export const validateForm = (values, rules) => {
  const errors = {};

  Object.keys(rules).forEach((field) => {
    const fieldRules = rules[field];
    const value = values[field];

    for (const rule of fieldRules) {
      const error = rule(value);
      if (error) {
        errors[field] = error;
        break;
      }
    }
  });

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
