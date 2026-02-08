import * as Sentry from '@sentry/react';
import { SENTRY_CONFIG } from './config';

export function initSentry() {
  if (!SENTRY_CONFIG.DSN) {
    console.log('Sentry DSN not configured - error tracking disabled');
    return;
  }

  Sentry.init({
    dsn: SENTRY_CONFIG.DSN,
    environment: SENTRY_CONFIG.ENVIRONMENT,
    integrations: [
      Sentry.browserTracingIntegration(),
      Sentry.replayIntegration({
        maskAllText: false,
        blockAllMedia: false,
      }),
    ],
    tracesSampleRate: SENTRY_CONFIG.TRACES_SAMPLE_RATE,
    replaysSessionSampleRate: SENTRY_CONFIG.REPLAYS_SESSION_SAMPLE_RATE,
    replaysOnErrorSampleRate: SENTRY_CONFIG.REPLAYS_ON_ERROR_SAMPLE_RATE,
  });
}

export { Sentry };

