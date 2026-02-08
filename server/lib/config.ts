/**
 * Server-side configuration constants
 */

// Server Configuration
export const SERVER_CONFIG = {
  PORT: process.env.PORT || 3001,
  NODE_ENV: process.env.NODE_ENV || 'development',
  IS_PRODUCTION: process.env.NODE_ENV === 'production',
} as const;

// JWT Configuration
export const JWT_CONFIG = {
  SECRET: process.env.JWT_SECRET || 'your-secret-key-change-in-production',
  EXPIRES_IN: '7d',
  ALGORITHM: 'HS256',
} as const;

// Bcrypt Configuration
export const BCRYPT_CONFIG = {
  SALT_ROUNDS: 10,
} as const;

// Sentry Configuration
export const SENTRY_CONFIG = {
  DSN: process.env.SENTRY_DSN,
  ENVIRONMENT: process.env.NODE_ENV || 'development',
  TRACES_SAMPLE_RATE: 1.0,
  PROFILES_SAMPLE_RATE: 1.0,
} as const;

// Rate Limiting Configuration
export const RATE_LIMIT_CONFIG = {
  WINDOW_MS: 15 * 60 * 1000, // 15 minutes
  MAX_REQUESTS: 100,
  AUTH: {
    WINDOW_MS: 15 * 60 * 1000,
    MAX_REQUESTS: 5,
    SKIP_SUCCESSFUL: true,
  },
} as const;

// Validation Configuration
export const VALIDATION_CONFIG = {
  PASSWORD_MIN_LENGTH: 6,
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
} as const;

