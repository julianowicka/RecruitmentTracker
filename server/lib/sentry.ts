import * as Sentry from '@sentry/node';

const SENTRY_DSN = process.env.SENTRY_DSN;

export function initServerSentry(): boolean {
  if (!SENTRY_DSN) {
    console.log('Sentry DSN not configured - error tracking disabled');
    return false;
  }

  Sentry.init({
    dsn: SENTRY_DSN,
    environment: process.env.NODE_ENV || 'development',
    tracesSampleRate: 1.0,
  });

  return true;
}

export { Sentry };
