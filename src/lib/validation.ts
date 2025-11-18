/**
 * Shared validation functions for contact form
 * Used on both client and server side
 */

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * Validates that a value is not empty after trimming whitespace
 */
export function validateRequired(value: string, fieldName: string): ValidationResult {
  const trimmed = value.trim();

  if (trimmed.length === 0) {
    return {
      isValid: false,
      error: `${fieldName} is required`,
    };
  }

  return { isValid: true };
}

/**
 * Validates email format
 * Uses simple regex that catches most invalid emails
 */
export function validateEmail(email: string): ValidationResult {
  const trimmed = email.trim();

  if (trimmed.length === 0) {
    return {
      isValid: false,
      error: 'Email is required',
    };
  }

  // RFC 5321 max length for email
  if (trimmed.length > 254) {
    return {
      isValid: false,
      error: 'Email address is too long',
    };
  }

  // Simple email regex - catches most invalid formats
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(trimmed)) {
    return {
      isValid: false,
      error: 'Please enter a valid email address',
    };
  }

  return { isValid: true };
}

/**
 * Validates string length is within min/max bounds
 */
export function validateLength(
  value: string,
  fieldName: string,
  min: number,
  max: number
): ValidationResult {
  const trimmed = value.trim();
  const length = trimmed.length;

  if (length < min) {
    return {
      isValid: false,
      error: `${fieldName} must be at least ${min} characters`,
    };
  }

  if (length > max) {
    return {
      isValid: false,
      error: `${fieldName} must be ${max} characters or less`,
    };
  }

  return { isValid: true };
}

/**
 * Validates all contact form fields
 * Returns object with field-specific errors
 */
export interface ContactFormData {
  name: string;
  email: string;
  linkedin: string;
  message: string;
  honeypot?: string;
}

export interface ContactFormErrors {
  name?: string;
  email?: string;
  linkedin?: string;
  message?: string;
}

/**
 * Validates LinkedIn URL format
 */
export function validateLinkedIn(url: string): ValidationResult {
  const trimmed = url.trim();

  if (trimmed.length === 0) {
    return {
      isValid: false,
      error: 'LinkedIn URL is required',
    };
  }

  // Check if it's a valid LinkedIn URL
  const linkedInPattern = /^https?:\/\/(www\.)?linkedin\.com\/in\/[a-zA-Z0-9_-]+\/?$/;

  if (!linkedInPattern.test(trimmed)) {
    return {
      isValid: false,
      error: 'Please enter a valid LinkedIn profile URL (e.g., https://linkedin.com/in/yourname)',
    };
  }

  return { isValid: true };
}

export function validateContactForm(data: ContactFormData): {
  isValid: boolean;
  errors: ContactFormErrors;
} {
  const errors: ContactFormErrors = {};

  // Validate name
  const nameRequired = validateRequired(data.name, 'Name');
  if (!nameRequired.isValid) {
    errors.name = nameRequired.error;
  } else {
    const nameLength = validateLength(data.name, 'Name', 1, 100);
    if (!nameLength.isValid) {
      errors.name = nameLength.error;
    }
  }

  // Validate email
  const emailResult = validateEmail(data.email);
  if (!emailResult.isValid) {
    errors.email = emailResult.error;
  }

  // Validate LinkedIn URL
  const linkedInResult = validateLinkedIn(data.linkedin);
  if (!linkedInResult.isValid) {
    errors.linkedin = linkedInResult.error;
  }

  // Validate message
  const messageRequired = validateRequired(data.message, 'Message');
  if (!messageRequired.isValid) {
    errors.message = messageRequired.error;
  } else {
    const messageLength = validateLength(data.message, 'Message', 1, 2000);
    if (!messageLength.isValid) {
      errors.message = messageLength.error;
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
