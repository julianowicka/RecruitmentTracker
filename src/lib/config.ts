/**
 * Configuration constants for the application
 */

// API Configuration
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:3001',
  TIMEOUT: 30000,
  ENDPOINTS: {
    AUTH: '/api/auth',
    APPLICATIONS: '/api/applications',
    NOTES: '/api/notes',
    STATS: '/api/stats',
    STATUS_HISTORY: '/api/status-history',
  },
} as const;

// Authentication Configuration
export const AUTH_CONFIG = {
  TOKEN_KEY: 'auth_token',
  JWT_EXPIRES_IN: '7d',
  PASSWORD_MIN_LENGTH: 6,
  BCRYPT_SALT_ROUNDS: 10,
} as const;

// Sentry Configuration
export const SENTRY_CONFIG = {
  DSN: import.meta.env.VITE_SENTRY_DSN,
  ENVIRONMENT: import.meta.env.MODE,
  TRACES_SAMPLE_RATE: 1.0,
  REPLAYS_SESSION_SAMPLE_RATE: 0.1,
  REPLAYS_ON_ERROR_SAMPLE_RATE: 1.0,
} as const;

// Rate Limiting Configuration
export const RATE_LIMIT_CONFIG = {
  WINDOW_MS: 15 * 60 * 1000, // 15 minutes
  MAX_REQUESTS: 100,
  AUTH_MAX_REQUESTS: 5,
} as const;

// Query Configuration
export const QUERY_CONFIG = {
  STALE_TIME: 5 * 60 * 1000, // 5 minutes
  CACHE_TIME: 10 * 60 * 1000, // 10 minutes
  RETRY_COUNT: 3,
} as const;

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
} as const;

