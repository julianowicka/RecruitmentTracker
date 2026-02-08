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
import { SERVER_CONFIG } from './lib/config';

// Initialize Sentry FIRST
initServerSentry();

const app = express();

// Sentry request handler must be first
app.use(Sentry.Handlers.requestHandler());
// Sentry tracing
app.use(Sentry.Handlers.tracingHandler());

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  crossOriginEmbedderPolicy: false, // Allow loading external resources
}));

// CORS
app.use(cors());

// Body parser
app.use(express.json());

// Rate limiting for all API routes
app.use('/api/', apiLimiter);

// Routes
app.use('/api/auth', authRouter);
app.use('/api/applications', applicationsRouter);
app.use('/api/notes', notesRouter);
app.use('/api/status-history', statusHistoryRouter);
app.use('/api/stats', statsRouter);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Sentry error handler must be BEFORE other error handlers
app.use(Sentry.Handlers.errorHandler());

// Error handler middleware (must be last)
app.use(errorHandler);

app.listen(SERVER_CONFIG.PORT, () => {
  console.log(`✅ Server running on http://localhost:${SERVER_CONFIG.PORT}`);
  console.log(`🛡️  Security: Helmet + Rate Limiting enabled`);
  console.log(`📊 Monitoring: Sentry error tracking active`);
});

