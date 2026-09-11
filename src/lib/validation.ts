/**
 * Shared validation functions for contact form
 * Used on both client and server side
 */

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

/** Zero-width and BOM characters that survive trim() but render as nothing. */
const ZERO_WIDTH = /[\u200B-\u200D\u2060\uFEFF]/g;
/** C0/C1 control characters. */
const CONTROL_CHARS = /[\u0000-\u001F\u007F-\u009F]/g;
/** Control characters other than tab and newline. */
const CONTROL_CHARS_EXCEPT_BREAKS =
  /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F-\u009F]/g;

/**
 * Normalizes a single-line field: drops anything that is not a string,
 * strips zero-width and control characters, then trims.
 *
 * Control characters matter beyond tidiness here: `name` is interpolated into
 * the email subject, so CRLF must never survive.
 */
export function normalizeSingleLine(value: unknown): string {
  if (typeof value !== "string") return "";
  return value.replace(ZERO_WIDTH, "").replace(CONTROL_CHARS, "").trim();
}

/**
 * Normalizes a multi-line field, preserving newlines and tabs.
 */
export function normalizeMultiline(value: unknown): string {
  if (typeof value !== "string") return "";
  return value
    .replace(/\r\n?/g, "\n")
    .replace(ZERO_WIDTH, "")
    .replace(CONTROL_CHARS_EXCEPT_BREAKS, "")
    .trim();
}

/** Counts characters rather than UTF-16 code units, so emoji count as one. */
function characterLength(value: string): number {
  return Array.from(value).length;
}

/**
 * Validates that a value is not empty once normalized
 */
export function validateRequired(
  value: unknown,
  fieldName: string,
): ValidationResult {
  if (normalizeSingleLine(value).length === 0) {
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
export function validateEmail(email: unknown): ValidationResult {
  const trimmed = normalizeSingleLine(email);

  if (trimmed.length === 0) {
    return {
      isValid: false,
      error: "Email is required",
    };
  }

  // RFC 5321 max length for email
  if (trimmed.length > 254) {
    return {
      isValid: false,
      error: "Email address is too long",
    };
  }

  // Simple email regex - catches most invalid formats
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(trimmed)) {
    return {
      isValid: false,
      error: "Please enter a valid email address",
    };
  }

  return { isValid: true };
}

/**
 * Validates string length is within min/max bounds
 */
export function validateLength(
  value: unknown,
  fieldName: string,
  min: number,
  max: number,
): ValidationResult {
  const length = characterLength(normalizeMultiline(value));

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

/** The normalized values that should be used downstream once validation passes. */
export interface NormalizedContact {
  name: string;
  email: string;
  linkedin: string;
  message: string;
}

export const FIELD_LIMITS = {
  name: 100,
  email: 254,
  linkedin: 200,
  message: 2000,
} as const;

/**
 * Validates LinkedIn URL format
 */
function validateLinkedIn(url: string): ValidationResult {
  if (url.length === 0) {
    return {
      isValid: false,
      error: "LinkedIn URL is required",
    };
  }

  const linkedInPattern =
    /^https?:\/\/(www\.)?linkedin\.com\/in\/[a-zA-Z0-9_-]+\/?$/i;

  if (!linkedInPattern.test(url)) {
    return {
      isValid: false,
      error:
        "Please enter a valid LinkedIn profile URL (e.g., https://linkedin.com/in/yourname)",
    };
  }

  return { isValid: true };
}

/**
 * Validates all contact form fields.
 *
 * Accepts unknown input so a malformed request body produces field errors
 * rather than a thrown TypeError, and returns the normalized values so callers
 * never send the raw input onward.
 */
export function validateContactForm(data: Partial<ContactFormData> | unknown): {
  isValid: boolean;
  errors: ContactFormErrors;
  normalized: NormalizedContact;
} {
  const source = (data ?? {}) as Record<string, unknown>;

  const normalized: NormalizedContact = {
    name: normalizeSingleLine(source.name),
    email: normalizeSingleLine(source.email),
    linkedin: normalizeSingleLine(source.linkedin),
    message: normalizeMultiline(source.message),
  };

  const errors: ContactFormErrors = {};

  if (normalized.name.length === 0) {
    errors.name = "Name is required";
  } else {
    const nameLength = validateLength(
      normalized.name,
      "Name",
      1,
      FIELD_LIMITS.name,
    );
    if (!nameLength.isValid) {
      errors.name = nameLength.error;
    }
  }

  const emailResult = validateEmail(normalized.email);
  if (!emailResult.isValid) {
    errors.email = emailResult.error;
  }

  const linkedInResult = validateLinkedIn(normalized.linkedin);
  if (!linkedInResult.isValid) {
    errors.linkedin = linkedInResult.error;
  }

  if (normalized.message.length === 0) {
    errors.message = "Message is required";
  } else {
    const messageLength = validateLength(
      normalized.message,
      "Message",
      1,
      FIELD_LIMITS.message,
    );
    if (!messageLength.isValid) {
      errors.message = messageLength.error;
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    normalized,
  };
}
