
function getCorsOrigins(): string[] {
  const configuredOrigins = process.env.CORS_ORIGINS
    ?.split(',')
    .map((origin) => origin.trim())
    .filter(Boolean) ?? [];

  const frontendUrl = process.env.FRONTEND_URL?.trim();

  if (frontendUrl) {
    configuredOrigins.push(frontendUrl);
  }

  return [...new Set(configuredOrigins)];
}

const NODE_ENV = process.env.NODE_ENV || 'development';
const IS_PRODUCTION = NODE_ENV === 'production';
const CORS_ORIGINS = getCorsOrigins();
const JWT_SECRET = process.env.JWT_SECRET?.trim() || (IS_PRODUCTION ? '' : 'local-development-secret');
const FRONTEND_URL = process.env.FRONTEND_URL?.trim() || 'http://127.0.0.1:3001';

export const SERVER_CONFIG = {
  PORT: process.env.PORT || 3001,
  NODE_ENV,
  IS_PRODUCTION,
  DATABASE_URL: process.env.DATABASE_URL || './sqlite.db',
  CORS_ORIGINS,
  FRONTEND_URL,
} as const;

export const JWT_CONFIG = {
  SECRET: JWT_SECRET,
  EXPIRES_IN: '7d',
  ALGORITHM: 'HS256',
} as const;

export const BCRYPT_CONFIG = {
  SALT_ROUNDS: 10,
} as const;

export const SENTRY_CONFIG = {
  DSN: process.env.SENTRY_DSN,
  ENVIRONMENT: process.env.NODE_ENV || 'development',
  TRACES_SAMPLE_RATE: 1.0,
  PROFILES_SAMPLE_RATE: 1.0,
} as const;

export const EMAIL_CONFIG = {
  FROM: process.env.EMAIL_FROM || 'Recruitment Tracker <no-reply@localhost>',
  SMTP_HOST: process.env.SMTP_HOST?.trim() || '',
  SMTP_PORT: Number(process.env.SMTP_PORT || 587),
  SMTP_USER: process.env.SMTP_USER || '',
  SMTP_PASS: process.env.SMTP_PASS || '',
  SMTP_SECURE: process.env.SMTP_SECURE === 'true',
  LOG_VERIFICATION_LINKS: process.env.EMAIL_LOG_VERIFICATION_LINKS === 'true' || !IS_PRODUCTION,
  VERIFICATION_EXPIRES_HOURS: Number(process.env.EMAIL_VERIFICATION_EXPIRES_HOURS || 24),
} as const;

export const RATE_LIMIT_CONFIG = {
  WINDOW_MS: 15 * 60 * 1000, // 15 minutes
  MAX_REQUESTS: 100,
  AUTH: {
    WINDOW_MS: 15 * 60 * 1000,
    MAX_REQUESTS: 5,
    SKIP_SUCCESSFUL: true,
  },
} as const;

export const VALIDATION_CONFIG = {
  PASSWORD_MIN_LENGTH: 6,
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
} as const;

export const AUTH_CONFIG = {
  PASSWORD_MIN_LENGTH: VALIDATION_CONFIG.PASSWORD_MIN_LENGTH,
} as const;

export function validateServerConfig(): void {
  if (IS_PRODUCTION && !JWT_CONFIG.SECRET) {
    throw new Error('Missing required environment variable: JWT_SECRET');
  }

  if (IS_PRODUCTION && CORS_ORIGINS.length === 0) {
    throw new Error('Set FRONTEND_URL or CORS_ORIGINS in production');
  }
}
