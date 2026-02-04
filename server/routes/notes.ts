import { Router } from 'express';
import { db } from '../db';
import { notes } from '../db/schema';
import { eq, desc } from 'drizzle-orm';

export const notesRouter = Router();

// GET /api/notes?applicationId=X - Get notes for application
notesRouter.get('/', async (req, res) => {
  try {
    const { applicationId } = req.query;

    if (!applicationId) {
      return res.status(400).json({ error: 'applicationId is required' });
    }

    const appId = parseInt(applicationId as string, 10);

    const result = await db
      .select()
      .from(notes)
      .where(eq(notes.applicationId, appId))
      .orderBy(desc(notes.createdAt));

    res.json(result);
  } catch (error) {
    console.error('Error fetching notes:', error);
    res.status(500).json({ error: 'Failed to fetch notes' });
  }
});

// POST /api/notes - Create new note
notesRouter.post('/', async (req, res) => {
  try {
    const { applicationId, content } = req.body;

    if (!applicationId || !content) {
      return res.status(400).json({ error: 'applicationId and content are required' });
    }

    const result = await db
      .insert(notes)
      .values({
        applicationId,
        content,
      })
      .returning();

    res.status(201).json(result[0]);
  } catch (error) {
    console.error('Error creating note:', error);
    res.status(500).json({ error: 'Failed to create note' });
  }
});

// DELETE /api/notes/:id - Delete note
notesRouter.delete('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);

    await db.delete(notes).where(eq(notes.id, id));

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting note:', error);
    res.status(500).json({ error: 'Failed to delete note' });
  }
});

