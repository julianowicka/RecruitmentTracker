/**
 * Rate limiting middleware configuration
 * Protects API endpoints from abuse
 */
import rateLimit from 'express-rate-limit';
import { RATE_LIMIT_CONFIG } from '../lib/config';

/**
 * General API rate limiter
 * 100 requests per 15 minutes per IP
 */
export const apiLimiter = rateLimit({
  windowMs: RATE_LIMIT_CONFIG.WINDOW_MS,
  max: RATE_LIMIT_CONFIG.MAX_REQUESTS,
  message: {
    error: 'Too many requests from this IP, please try again later',
    retryAfter: RATE_LIMIT_CONFIG.WINDOW_MS / 1000,
  },
  standardHeaders: true, // Return rate limit info in headers
  legacyHeaders: false, // Disable X-RateLimit-* headers
});

/**
 * Strict rate limiter for authentication endpoints
 * 5 requests per 15 minutes per IP
 * Prevents brute force attacks
 */
export const authLimiter = rateLimit({
  windowMs: RATE_LIMIT_CONFIG.AUTH.WINDOW_MS,
  max: RATE_LIMIT_CONFIG.AUTH.MAX_REQUESTS,
  message: {
    error: 'Too many login attempts, please try again later',
    retryAfter: RATE_LIMIT_CONFIG.AUTH.WINDOW_MS / 1000,
  },
  skipSuccessfulRequests: RATE_LIMIT_CONFIG.AUTH.SKIP_SUCCESSFUL, // Don't count successful logins
  standardHeaders: true,
  legacyHeaders: false,
});

