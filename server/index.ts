import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { applicationsRouter } from './routes/applications';
import { notesRouter } from './routes/notes';
import { statusHistoryRouter } from './routes/status-history';
import { statsRouter } from './routes/stats';
import { authRouter } from './routes/auth';
import { errorHandler } from './middleware/errorHandler';
import { apiLimiter } from './middleware/rateLimit';
import { initServerSentry, Sentry } from './lib/sentry';
import { SERVER_CONFIG, validateServerConfig } from './lib/config';

validateServerConfig();
const isSentryEnabled = initServerSentry();

const app = express();
const currentFilePath = fileURLToPath(import.meta.url);
const currentDir = path.dirname(currentFilePath);
const distDir = path.resolve(currentDir, '../dist');

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", 'data:', 'https:'],
      },
    },
    crossOriginEmbedderPolicy: false,
  })
);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || !SERVER_CONFIG.IS_PRODUCTION) {
        callback(null, true);
        return;
      }

      if (SERVER_CONFIG.CORS_ORIGINS.includes(origin)) {
        callback(null, true);
        return;
      }

      callback(null, false);
    },
  })
);

app.use(express.json());

app.use('/api/', apiLimiter);

app.use('/api/auth', authRouter);
app.use('/api/applications', applicationsRouter);
app.use('/api/notes', notesRouter);
app.use('/api/status-history', statusHistoryRouter);
app.use('/api/stats', statsRouter);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

if (SERVER_CONFIG.IS_PRODUCTION) {
  app.use(express.static(distDir));

  app.get(/^(?!\/api(?:\/|$)).*/, (_req, res) => {
    res.sendFile(path.join(distDir, 'index.html'));
  });
}

if (isSentryEnabled) {
  Sentry.setupExpressErrorHandler(app);
}

app.use(errorHandler);

app.listen(SERVER_CONFIG.PORT, () => {
  console.log(`Server running on port ${SERVER_CONFIG.PORT}`);
  console.log('Security: Helmet + Rate Limiting enabled');
  console.log(
    isSentryEnabled
      ? 'Monitoring: Sentry error tracking active'
      : 'Monitoring: Sentry disabled (SENTRY_DSN not configured)'
  );
});
