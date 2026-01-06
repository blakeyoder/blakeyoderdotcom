/**
 * Environment configuration with validation
 * Validates required environment variables at module load time
 */

interface Config {
  resendApiKey: string;
  contactEmailTo: string;
  contactEmailFrom: string;
  rateLimitWindowMs: number;
  rateLimitMaxRequests: number;
  spamMaxUrls: number;
}

function getEnvVar(key: string, defaultValue?: string): string {
  const value = process.env[key];

  if (!value && !defaultValue) {
    throw new Error(
      `Missing required environment variable: ${key}. ` +
        `Please add it to your .env.local file. ` +
        `See .env.example for required variables.`,
    );
  }

  // Trim whitespace from environment variables
  return (value || defaultValue!).trim();
}

function getEnvNumber(key: string, defaultValue: number): number {
  const value = process.env[key];

  if (!value) {
    return defaultValue;
  }

  const parsed = parseInt(value, 10);

  if (isNaN(parsed)) {
    throw new Error(
      `Environment variable ${key} must be a number, got: ${value}`,
    );
  }

  return parsed;
}

// Email format validation - ensures format is compatible with Resend
function validateEmailFormat(email: string, fieldName: string): string {
  const trimmedEmail = email.trim();

  // Basic email format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(trimmedEmail)) {
    throw new Error(
      `Invalid email format for ${fieldName}: "${email}". ` +
        `Email must follow the format: email@example.com`,
    );
  }

  return trimmedEmail;
}

// Lazy-load configuration - only validate when accessed
let _config: Config | null = null;

function getConfig(): Config {
  if (!_config) {
    _config = {
      resendApiKey: getEnvVar("RESEND_API_KEY"),
      contactEmailTo: validateEmailFormat(
        getEnvVar("CONTACT_EMAIL_TO"),
        "CONTACT_EMAIL_TO",
      ),
      contactEmailFrom: validateEmailFormat(
        getEnvVar("CONTACT_EMAIL_FROM", "noreply@resend.dev"),
        "CONTACT_EMAIL_FROM",
      ),
      rateLimitWindowMs: getEnvNumber("RATE_LIMIT_WINDOW_MS", 5 * 60 * 1000), // 5 minutes
      rateLimitMaxRequests: getEnvNumber("RATE_LIMIT_MAX_REQUESTS", 1),
      spamMaxUrls: getEnvNumber("SPAM_MAX_URLS", 2),
    };
  }
  return _config;
}

// Export configuration object that validates on first access
export const config = new Proxy({} as Config, {
  get(_target, prop: keyof Config) {
    return getConfig()[prop];
  },
});
