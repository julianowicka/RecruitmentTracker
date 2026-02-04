import { Router } from 'express';
import { db } from '../db';
import { statusHistory } from '../db/schema';
import { eq, desc } from 'drizzle-orm';

export const statusHistoryRouter = Router();

// GET /api/status-history?applicationId=X - Get status history for application
statusHistoryRouter.get('/', async (req, res) => {
  try {
    const { applicationId } = req.query;

    if (!applicationId) {
      return res.status(400).json({ error: 'applicationId is required' });
    }

    const appId = parseInt(applicationId as string, 10);

    const result = await db
      .select()
      .from(statusHistory)
      .where(eq(statusHistory.applicationId, appId))
      .orderBy(desc(statusHistory.changedAt));

    res.json(result);
  } catch (error) {
    console.error('Error fetching status history:', error);
    res.status(500).json({ error: 'Failed to fetch status history' });
  }
});

