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
      `See .env.example for required variables.`
    );
  }

  return value || defaultValue!;
}

function getEnvNumber(key: string, defaultValue: number): number {
  const value = process.env[key];

  if (!value) {
    return defaultValue;
  }

  const parsed = parseInt(value, 10);

  if (isNaN(parsed)) {
    throw new Error(
      `Environment variable ${key} must be a number, got: ${value}`
    );
  }

  return parsed;
}

// Validate and export configuration
export const config: Config = {
  resendApiKey: getEnvVar('RESEND_API_KEY'),
  contactEmailTo: getEnvVar('CONTACT_EMAIL_TO'),
  contactEmailFrom: getEnvVar('CONTACT_EMAIL_FROM', 'noreply@resend.dev'),
  rateLimitWindowMs: getEnvNumber('RATE_LIMIT_WINDOW_MS', 5 * 60 * 1000), // 5 minutes
  rateLimitMaxRequests: getEnvNumber('RATE_LIMIT_MAX_REQUESTS', 1),
  spamMaxUrls: getEnvNumber('SPAM_MAX_URLS', 2),
};

// Export individual values for convenience
export const {
  resendApiKey,
  contactEmailTo,
  contactEmailFrom,
  rateLimitWindowMs,
  rateLimitMaxRequests,
  spamMaxUrls,
} = config;
