import express from 'express';
import cors from 'cors';
import { applicationsRouter } from './routes/applications';
import { notesRouter } from './routes/notes';
import { statusHistoryRouter } from './routes/status-history';
import { statsRouter } from './routes/stats';
import { errorHandler } from './middleware/errorHandler';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/applications', applicationsRouter);
app.use('/api/notes', notesRouter);
app.use('/api/status-history', statusHistoryRouter);
app.use('/api/stats', statsRouter);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handler middleware (must be last)
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

