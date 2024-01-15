export function isEmail(value) {
  return value.includes("@");
}

export function isNotEmpty(value) {
  return value.trim() !== "";
}

export function hasMinLength(value, minLength) {
  return value.length >= minLength;
}

export function isEqualsToOtherValue(value, otherValue) {
  return value === otherValue;
}
export function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

export const hasUpperCase = (value) => /[A-Z]/.test(value);

export const hasLowerCase = (value) => /[a-z]/.test(value);

export const hasDigit = (value) => /\d/.test(value);

export const hasSpecialChar = (value) => /[!@#$%^&*(),.?":{}|<>]/.test(value);
